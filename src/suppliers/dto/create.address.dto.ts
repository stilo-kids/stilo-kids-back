import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Length, Max, Min } from 'class-validator';

export class CreateAddressDto {
  @IsString({
    message: 'O logradouro deve ser um texto.',
  })
  @IsNotEmpty({
    message: 'O logradouro não pode estar vazio.',
  })
  @Length(3, 220, {
    message: 'O logradouro deve ter entre 3 e 220 caracteres.',
  })
  @ApiProperty({
    description: 'Logradouro',
    required: true,
    example: 'Rua das Flores',
  })
  readonly street: string;

  @IsString({
    message: 'A cidade deve ser um texto.',
  })
  @IsNotEmpty({
    message: 'A cidade não pode estar vazia.',
  })
  @Length(2, 100, {
    message: 'A cidade deve ter entre 2 e 100 caracteres.',
  })
  @ApiProperty({
    description: 'Cidade',
    required: true,
    example: 'São Paulo',
  })
  readonly city: string;

  @IsString({
    message: 'O bairro deve ser um texto.',
  })
  @IsNotEmpty({
    message: 'O bairro não pode estar vazio.',
  })
  @Length(3, 220, {
    message: 'O bairro deve ter entre 3 e 220 caracteres.',
  })
  @ApiProperty({
    description: 'Bairro',
    required: true,
    example: 'Jardim das Flores',
    type: String,
  })
  readonly neighborhood: string;

  @IsNumberString(
    {},
    {
      message: 'O número deve conter apenas caracteres numéricos.',
    },
  )
  @IsNotEmpty({
    message: 'O número não pode estar vazio.',
  })
  @Length(1, 20, {
    message: 'O número deve ter entre 1 e 20 caracteres.',
  })
  @ApiProperty({
    description: 'Número',
    required: true,
    example: '123',
    type: String,
  })
  readonly number: string;

  @IsNotEmpty({
    message: 'O ID do fornecedor não pode estar vazio.',
  })
  @IsNumberString(
    {},
    {
      message: 'O ID do fornecedor deve conter apenas caracteres numéricos.',
    },
  )
  @Min(1, {
    message: 'O ID do fornecedor deve ser um número maior ou igual a 1.',
  })
  @Max(9999, {
    message: 'O ID do fornecedor deve ser um número menor ou igual a 9999.',
  })
  @ApiProperty({
    description: 'ID do Fornecedor associado a este endereço',
    required: true,
    example: 1,
  })
  readonly supplierId: number;
}
