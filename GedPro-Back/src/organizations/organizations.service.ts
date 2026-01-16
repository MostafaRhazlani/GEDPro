import { UpdateStatusDto } from './dto/update-status.dto';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    userId: string,
  ): Promise<Organization> {
    // Check if user already has an organization
    const existingOrg = await this.organizationModel
      .findOne({ ownerId: userId })
      .exec();

    if (existingOrg) {
      throw new ConflictException(
        'You already have an organization. Each RH Admin can only create one organization.',
      );
    }

    // Check if email is already taken
    const emailExists = await this.organizationModel
      .findOne({ email: createOrganizationDto.email })
      .exec();

    if (emailExists) {
      throw new ConflictException(
        'An organization with this email already exists.',
      );
    }

    const organization = new this.organizationModel({
      ...createOrganizationDto,
      ownerId: userId,
    });

    return organization.save();
  }

  async findOne(id: string, userId: string): Promise<Organization> {
    const organization = await this.organizationModel
      .findById(id)
      .populate('ownerId')
      .exec();

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    // Check if the user is the owner of the organization
    if (organization.ownerId.toString() !== userId) {
      throw new ForbiddenException('You can only view your own organization');
    }

    return organization;
  }

  async findByOwnerId(ownerId: string): Promise<Organization> {
    const organization = await this.organizationModel
      .findOne({ ownerId })
      .populate('ownerId')
      .exec();

    if (!organization) {
      throw new NotFoundException('You do not have any organization yet');
    }

    return organization;
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
    userId: string,
  ): Promise<Organization> {
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    // check if the user is the owner of the organization
    if (organization.ownerId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own organization');
    }

    // check if email is being updated and if it's already taken by another organization
    if (
      updateOrganizationDto.email &&
      updateOrganizationDto.email !== organization.email
    ) {
      const emailExists = await this.organizationModel
        .findOne({ email: updateOrganizationDto.email, _id: { $ne: id } })
        .exec();

      if (emailExists) {
        throw new ConflictException(
          'An organization with this email already exists.',
        );
      }
    }

    Object.assign(organization, updateOrganizationDto);
    return organization.save();
  }

  async changeStatus(
    id: string,
    userId: string,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Organization> {
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    // Check if the user is the owner of the organization
    if (organization.ownerId.toString() !== userId) {
      throw new ForbiddenException(
        'You can only activate your own organization',
      );
    }

    organization.status = updateStatusDto.status;
    return organization.save();
  }
}
