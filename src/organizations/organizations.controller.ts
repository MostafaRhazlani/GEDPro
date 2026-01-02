import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Roles as RoleEnum } from 'src/users/enums/user.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { JwtPayload } from 'src/auth/interfaces/auth.interface';

@ApiTags('organizations')
@Controller('organization')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @Roles(RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Create organization (HR Admin only)' })
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.organizationsService.create(
      createOrganizationDto,
      req.user.sub,
    );
  }

  @Get('my-organization')
  @Roles(RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Get my organization (HR Admin only)' })
  findMyOrganization(@Request() req: { user: JwtPayload }) {
    return this.organizationsService.findByOwnerId(req.user.sub);
  }

  @Get(':id')
  @Roles(RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Get organization by ID (own organization only)' })
  findOne(@Param('id') id: string, @Request() req: { user: JwtPayload }) {
    return this.organizationsService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @Roles(RoleEnum.HR_ADMIN)
  @ApiOperation({ summary: 'Update organization (HR Admin owner only)' })
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.organizationsService.update(
      id,
      updateOrganizationDto,
      req.user.sub,
    );
  }
}
