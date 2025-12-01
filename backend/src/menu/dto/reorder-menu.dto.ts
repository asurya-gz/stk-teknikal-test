import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderMenuDto {
  @ApiProperty({
    description: 'New order position within the same level',
    example: 3,
    minimum: 0,
  })
  @IsInt({ message: 'New order must be an integer' })
  @Min(0, { message: 'New order must be greater than or equal to 0' })
  @Type(() => Number)
  newOrder: number;
}
