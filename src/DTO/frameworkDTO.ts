import { IsNotEmpty, IsDefined, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FrameworkWriteDTO {
  @ApiProperty({
    name: 'name',
    description: 'The name of the framework',
    required: true,
    type: String,
    isArray: false,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    name: 'author',
    description: 'The group that has authored the framework',
    required: true,
    type: String,
    isArray: false,
    maxLength: 1000,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  author: string;

  @ApiProperty({
    name: 'year',
    description: 'The year that the framework was published for',
    required: true,
    type: String,
    isArray: false,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  year: string;

  @ApiProperty({
    name: 'levels',
    description: 'Can either be high, K12, college, post-grad, or professional',
    required: true,
    type: [String],
    isArray: false,
  })
  @IsDefined()
  @IsNotEmpty()
  levels: string[];
}
