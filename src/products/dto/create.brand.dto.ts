import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export default class CreateBrandDto {
    @IsString({
        message: 'O nome da marca deve ser um texto.',
    })
    @IsNotEmpty({
        message: 'O nome da marca não pode estar vazio.',
    })
    @Length(3, 200, {
        message: 'O nome da marca deve ter entre 3 e 200 caracteres.',
    })
    @ApiProperty({
        description: 'Nome da Marca',
        required: true,
        example: "Adidas",
    })
    readonly name: string;
}