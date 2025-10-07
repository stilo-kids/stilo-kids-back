import { ApiProperty } from '@nestjs/swagger';
import { Telephone } from '../entities/telephone.entity';

export class TelephoneDto {
  @ApiProperty({
    description: 'ID do Telefone',
    example: 1,
    readOnly: true,
  })
  id: number;

  @ApiProperty({
    description: 'Número de Telefone',
    example: '+55 11 91234-5678',
    readOnly: true,
  })
  number: string;

  @ApiProperty({
    description: 'ID do Fornecedor',
    example: 1,
    readOnly: true,
  })
  supplierId: number;

  @ApiProperty({
    description: 'Data de Criação',
    example: '2023-01-01 00:00:00',
    readOnly: true,
  })
  createdAt: Date;

  constructor(telephone: Telephone) {
    this.id = telephone.id;
    this.number = telephone.number;
    this.supplierId = telephone.supplierId;
    this.createdAt = telephone.createdAt;
  }
}
