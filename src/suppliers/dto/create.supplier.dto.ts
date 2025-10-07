import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSupplierTelephoneDto } from './create.supplier.telephone.dto';
import { CreateSupplierAddressDto } from './create.supplier.address.dto';

export default class CreateSupplierDto {
  @IsString({
    message: 'O nome do fornecedor deve ser um texto.',
  })
  @IsNotEmpty({
    message: 'O nome do fornecedor não pode estar vazio.',
  })
  @Length(3, 200, {
    message: 'O nome do fornecedor deve ter entre 3 e 200 caracteres.',
  })
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
