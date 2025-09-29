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
import { AddressService } from '../services/address.service';
import AddressDto from '../dto/address.dto';
import { Address } from '../entities/address.entity';
import { CreateAddressDto } from '../dto/create.address.dto';
import { UpdateAddressDto } from '../dto/update.address.dto';

@ApiTags('Endereços do Fornecedor')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @ApiOkResponse({
    description: 'Lista de endereços retornada com sucesso.',
    type: [AddressDto],
  })
  async findAll(): Promise<Array<AddressDto>> {
    const addresses: Address[] = await this.addressService.findAll();
    return addresses.map((address) => new AddressDto(address));
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Endereço criado com sucesso.',
    type: AddressDto,
  })
  async create(
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<AddressDto> {
    const address: Address = await this.addressService.create(createAddressDto);
    return new AddressDto(address);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Endereço retornado com sucesso.',
    type: AddressDto,
  })
  async findOne(@Param('id') id: string): Promise<AddressDto> {
    const address: Address | null = await this.addressService.findOne(+id);
    if (!address)
      throw new HttpException(
        {
          type: 'error',
          message: 'Endereço não encontrado.',
        },
        404,
      );
    return new AddressDto(address);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Endereço atualizado com sucesso.',
    type: AddressDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<AddressDto> {
    const address: Address = await this.addressService.update(
      +id,
      updateAddressDto,
    );
    return new AddressDto(address);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Endereço deletado com sucesso.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    const address: Address | null = await this.addressService.findOne(+id);
    if (!address)
      throw new HttpException(
        {
          type: 'error',
          message: 'Endereço não encontrado.',
        },
        404,
      );

    return await this.addressService.remove(address);
  }
}
