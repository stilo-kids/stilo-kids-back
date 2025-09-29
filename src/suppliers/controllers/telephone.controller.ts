import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TelephoneService } from '../services/telephone.service';
import { TelephoneDto } from '../dto/telephone.dto';
import { Telephone } from '../entities/telephone.entity';
import { CreateTelephoneDto } from '../dto/create.telephone.dto';
import { UpdateTelephoneDto } from '../dto/update.telephone.dto';

@ApiTags('Telefones do Fornecedor')
@Controller('telephones')
export class TelephoneController {
  constructor(private readonly telephoneService: TelephoneService) {}

  @Get()
  @ApiOkResponse({
    description: 'Lista de telefones retornada com sucesso.',
    type: [TelephoneDto],
  })
  async findAll(): Promise<TelephoneDto[]> {
    const telephones: Telephone[] = await this.telephoneService.findAll();
    return telephones.map((telephone) => new TelephoneDto(telephone));
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Telefone criado com sucesso.',
    type: TelephoneDto,
  })
  async create(
    @Body() telephoneDto: CreateTelephoneDto,
  ): Promise<TelephoneDto> {
    const telephone: Telephone =
      await this.telephoneService.create(telephoneDto);
    return new TelephoneDto(telephone);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Telefone retornado com sucesso.',
    type: TelephoneDto,
  })
  async findOne(@Param('id') id: string): Promise<TelephoneDto> {
    const telephone: Telephone | null =
      await this.telephoneService.findOne(+id);
    if (!telephone)
      throw new HttpException(
        {
          type: 'error',
          message: 'Telefone não encontrado.',
        },
        404,
      );
    return new TelephoneDto(telephone);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Telefone atualizado com sucesso.',
    type: TelephoneDto,
  })
  async update(
    @Param('id') id: string,
    @Body() telephoneDto: UpdateTelephoneDto,
  ): Promise<TelephoneDto> {
    const telephone: Telephone | null = await this.telephoneService.update(
      +id,
      telephoneDto,
    );
    if (!telephone)
      throw new HttpException(
        {
          type: 'error',
          message: 'Telefone não encontrado.',
        },
        404,
      );
    return new TelephoneDto(telephone);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Telefone deletado com sucesso.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    const telephone: Telephone | null =
      await this.telephoneService.findOne(+id);
    if (!telephone)
      throw new HttpException(
        {
          type: 'error',
          message: 'Telefone não encontrado.',
        },
        404,
      );
    await this.telephoneService.remove(telephone);
  }
}
