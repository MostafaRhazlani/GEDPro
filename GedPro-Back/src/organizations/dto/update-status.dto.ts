// src/organizations/dto/update-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrganizationStatus } from '../enums/organization.enum';

export class UpdateStatusDto {
  @ApiProperty({
    example: 'ACTIVE',
    enum: OrganizationStatus,
    description: 'Valid status: ACTIVE, PENDING, REJECTED',
  })
  @IsEnum(OrganizationStatus)
  @IsNotEmpty()
  status: OrganizationStatus;
}
