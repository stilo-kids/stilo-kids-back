import { ApiProperty } from '@nestjs/swagger';

export class UpdateTelephoneDto {
  @ApiProperty({
    description: 'Número de Telefone',
    required: true,
    example: '+55 11 91234-5678',
  })
  readonly number: string;

  @ApiProperty({
    description: 'ID do Fornecedor',
    required: true,
    example: 1,
  })
  readonly supplierId: number;
}
