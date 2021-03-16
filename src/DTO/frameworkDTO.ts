import { IsNotEmpty, IsDefined, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FrameworkWriteDTO {

    @ApiProperty({
        name: '',
        description: '',
        required: true,
        type: String,
        isArray: true, // Set true for Open API enum dropdown menu
    })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    bloom: string;




    @ApiProperty({
        name: '',
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
    text: string;
 



    @ApiProperty({
        name: '',
        description: '',
        required: true,
        type: String,
        isArray: false,
    })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    verb: string; // TODO: required, must be a verb within the list for the selected bloom

}