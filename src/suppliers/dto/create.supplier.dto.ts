import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSupplierTelephoneDto } from './create.supplier.telephone.dto';
import { CreateSupplierAddressDto } from './create.supplier.address.dto';

export default class CreateSupplierDto {
  @ApiProperty({
    description: 'Nome do Fornecedor',
    required: true,
    example: "Isadora's Style LTDA",
  })
  readonly name: string;

  @ApiProperty({
    description: 'Endereços do Fornecedor',
    type: [CreateSupplierAddressDto],
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateSupplierAddressDto)
  readonly addresses: Array<CreateSupplierAddressDto>;

  @ApiProperty({
    description: 'Telefones do Fornecedor',
    type: [CreateSupplierTelephoneDto],
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateSupplierTelephoneDto)
  readonly telephones: Array<CreateSupplierTelephoneDto>;
}
