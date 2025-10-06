import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Length, Matches, Max, Min } from 'class-validator';

export class CreateTelephoneDto {
  @IsString({
    message: 'O número de telefone deve ser um texto.',
  })
  @IsNotEmpty({
    message: 'O número de telefone não pode estar vazio.',
  })
  @Length(8, 20, {
    message: 'O número de telefone deve ter entre 8 e 20 caracteres.',
  })
  @Matches(/^\+55 \d{2} \d{5}-\d{4}$/, {
    message: 'O telefone deve estar no formato +55 XX 9XXXX-XXXX',
  })
  @ApiProperty({
    description: 'Número de Telefone',
    required: true,
    example: '+55 11 91234-5678',
  })
  readonly number: string;

  @IsNotEmpty({
    message: 'O ID do fornecedor não pode estar vazio.',
  })
  @IsNumberString({}, {
    message: 'O ID do fornecedor deve conter apenas caracteres numéricos.',
  })
  @Min(1, {
    message: 'O ID do fornecedor deve ser um número maior ou igual a 1.',
  })
  @Max(9999, {
    message: 'O ID do fornecedor deve ser um número menor ou igual a 9999.',
  })
  @ApiProperty({
    description: 'ID do Fornecedor',
    required: true,
    example: 1,
  })
  readonly supplierId: number;
}
