import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsDefined, IsString, MaxLength } from 'class-validator';

export class GuidelineWriteDTO {

    @ApiProperty({
        name: 'name',
        description: 'The name of the guideline',
        required: true,
        type: String,
        isArray: false, 
    })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    name: string;




    @ApiProperty({
        name: 'guidelineText',
        description: 'The text of the given guideline',
        required: true,
        type: String,
        isArray: false,
        maxLength: 1000,
    })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MaxLength(1000)
    guidelineText: string;

}