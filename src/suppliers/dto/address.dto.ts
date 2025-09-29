import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../entities/address.entity';

export default class AddressDto {
  @ApiProperty({
    description: 'ID do endereço do Fornecedor',
    example: 1,
    readOnly: true,
  })
  readonly id: number;

  @ApiProperty({
    description: 'Logradouro',
    example: 'Av. Dr. Renato Dantas',
    readOnly: true,
  })
  readonly street: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'Caicó',
    readOnly: true,
  })
  readonly city: string;

  @ApiProperty({
    description: 'Bairro',
    example: 1,
    readOnly: true,
  })
  readonly neighborhood: string;

  @ApiProperty({
    description: 'Número do local',
    example: 1,
    readOnly: true,
  })
  readonly number: string;

  @ApiProperty({
    description: 'Data de cadastro',
    example: '2012-12-16 12:00:00',
    readOnly: true,
  })
  readonly createdAt: Date | null;

  @ApiProperty({
    description: 'Fornecedor associado a este endereço',
    example: [],
    readOnly: true,
  })
  readonly supplierId: number | null;

  constructor(address: Address) {
    this.id = address.id;
    this.street = address.street;
    this.city = address.city;
    this.neighborhood = address.neighborhood;
    this.number = address.number;
    this.createdAt = address.createdAt;
    this.supplierId = address.supplierId;
  }
}
