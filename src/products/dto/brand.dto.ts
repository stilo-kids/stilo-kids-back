import { ApiProperty } from '@nestjs/swagger';
import { Brand } from '../entities/brand.entity';

export default class BrandDto {
    @ApiProperty({
        description: 'ID da Marca',
        example: 1,
        readOnly: true,
    })
    readonly id: number;

    @ApiProperty({
        description: 'Nome da Marca',
        example: "Adidas",
        readOnly: true,
    })
    readonly name: string;

    @ApiProperty({
        description: 'Data de criação da Marca',
        example: '2012-12-16 12:00:00',
        readOnly: true,
    })
    readonly createdAt: Date;

    constructor(brand: Brand) {
        this.id = brand.id;
        this.name = brand.name;
        this.createdAt = brand.createdAt;
    }
}