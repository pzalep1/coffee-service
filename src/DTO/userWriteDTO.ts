import { IsNotEmpty, IsDefined, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserWriteDTO {
  @ApiProperty({
    name: 'email',
    description: 'Email used to login',
    required: true,
    type: String,
    isArray: false,
    minLength: 3,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    name: 'password',
    description: 'The group the user belongs to',
    required: true,
    type: String,
    isArray: false,
    format: "password",
    minLength: 3,
    maxLength: 1000,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  password: string;

  @ApiProperty({
    name: 'organization',
    description: 'The group the user belongs to',
    required: true,
    type: String,
    isArray: false,
    minLength: 3,
    maxLength: 1000,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  organization: string;

  @ApiProperty({
    name: 'name',
    description: 'Username to use to identify yourself to other users',
    required: true,
    type: String,
    isArray: false,
    minLength: 3,
    maxLength: 30,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;
}
