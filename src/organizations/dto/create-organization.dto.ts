import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationStatus } from '../enums/organization.enum';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Tech Solutions Inc.',
    description: 'The name of the organization',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'The URL of the organization image',
  })
  image: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'contact@techsolutions.com',
    description: 'The official email of the organization',
  })
  email: string;

  @IsOptional()
  @IsEnum(OrganizationStatus)
  @ApiProperty({
    enum: OrganizationStatus,
    default: OrganizationStatus.PENDING,
    description: 'The current status of the organization',
    required: false,
  })
  status?: OrganizationStatus;
}
