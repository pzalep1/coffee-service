import { IsNotEmpty, IsDefined, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FrameworkWriteDTO {

    @ApiProperty({
        name: 'name',
        description: '',
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
        description: '',
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
        description: '',
        required: true,
        type: String,
        isArray: false,
    })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    year: string;

}