import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';

export class MoveMenuDto {
  @ApiProperty({
    description: 'New parent menu ID (null to move to root level)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  @IsOptional()
  newParentId?: string;
}
