import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNotEmpty, MaxLength, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuDto {
  @ApiProperty({
    description: 'The name of the menu item',
    example: 'Dashboard',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string;

  @ApiPropertyOptional({
    description: 'The URL or route path',
    example: '/dashboard',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'URL must not exceed 500 characters' })
  url?: string;

  @ApiPropertyOptional({
    description: 'Icon identifier',
    example: 'dashboard-icon',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Icon must not exceed 100 characters' })
  icon?: string;

  @ApiPropertyOptional({
    description: 'Display order within the same level',
    example: 1,
    minimum: 0,
  })
  @IsInt({ message: 'Order must be an integer' })
  @IsOptional()
  @Min(0, { message: 'Order must be greater than or equal to 0' })
  @Type(() => Number)
  order?: number;

  @ApiPropertyOptional({
    description: 'Parent menu ID (null for root items)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  @IsOptional()
  parentId?: string;
}
