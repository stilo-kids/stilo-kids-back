import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressDto {
  @ApiProperty({
    description: 'Logradouro',
    required: true,
    example: 'Rua das Flores',
  })
  readonly street: string;

  @ApiProperty({
    description: 'Cidade',
    required: true,
    example: 'São Paulo',
  })
  readonly city: string;

  @ApiProperty({
    description: 'Bairro',
    required: true,
    example: 'Jardim das Flores',
  })
  readonly neighborhood: string;

  @ApiProperty({
    description: 'Número',
    required: true,
    example: '123',
  })
  readonly number: string;

  @ApiProperty({
    description: 'ID do Fornecedor associado a este endereço',
    required: true,
    example: 1,
  })
  readonly supplierId: number;
}
