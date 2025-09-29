import { ApiProperty } from '@nestjs/swagger';
import { Supplier } from '../entities/supplier.entity';
import AddressDto from './address.dto';
import { TelephoneDto } from './telephone.dto';

export default class SupplierDto {
  @ApiProperty({
    description: 'ID do Fornecedor',
    example: 1,
    readOnly: true,
  })
  readonly id: number;

  @ApiProperty({
    description: 'Nome do Fornecedor',
    example: "Isadora's Style LTDA",
    readOnly: true,
  })
  readonly name: string;

  @ApiProperty({
    description: 'Data de criação do Fornecedor',
    example: '2012-12-16 12:00:00',
    readOnly: true,
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Endereços do Fornecedor',
    example: [],
    readOnly: true,
  })
  readonly addresses: Array<AddressDto>;

  @ApiProperty({
    description: 'Telefones do Fornecedor',
    example: [],
    readOnly: true,
  })
  readonly telephones: Array<TelephoneDto>;

  constructor(supplier: Supplier) {
    this.id = supplier.id;
    this.name = supplier.name;
    this.createdAt = supplier.createdAt;
    this.addresses = supplier.addresses
      ? supplier.addresses.map((address) => new AddressDto(address))
      : [];
    this.telephones = supplier.telephones
      ? supplier.telephones.map((telephone) => new TelephoneDto(telephone))
      : [];
  }
}
