import { ApiProperty } from '@nestjs/swagger';

export default class CreateSupplierDto {
  @ApiProperty({
    description: 'Nome do Fornecedor',
    required: true,
    example: "Isadora's Style LTDA",
  })
  readonly name: string;
}
