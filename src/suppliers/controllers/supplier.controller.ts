import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SupplierService } from '../services/supplier.service';
import { Supplier } from '../entities/supplier.entity';
import CreateSupplierDto from '../dto/create.supplier.dto';
import SupplierDto from '../dto/supplier.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import UpdateSupplierDto from '../dto/update.supplier.dto';

@ApiTags('Fornecedores')
@Controller('suppliers')
export class SupplierController {
  constructor(
    private readonly supplierService: SupplierService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Lista de fornecedores retornada com sucesso.',
    type: [SupplierDto],
  })
  async findAll(): Promise<Array<SupplierDto>> {
    const suppliers: Supplier[] = await this.supplierService.findAll();
    return suppliers.map((supplier) => new SupplierDto(supplier));
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Fornecedor criado com sucesso.',
    type: SupplierDto,
  })
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<SupplierDto> {
    const supplier: Supplier = await this.supplierService.create(createSupplierDto);
    return new SupplierDto(supplier);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Fornecedor retornado com sucesso.',
    type: SupplierDto,
  })
  async findOne(@Param('id') id: string): Promise<SupplierDto> {
    const supplier: Supplier | null = await this.supplierService.findOne(+id);
    if (!supplier) throw new NotFoundException('Fornecedor não encontrado.');
    return new SupplierDto(supplier);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Fornecedor atualizado com sucesso.',
    type: SupplierDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<SupplierDto> {
    const supplier: Supplier | null = await this.supplierService.findOne(+id);
    if (!supplier) throw new NotFoundException('Fornecedor não encontrado.');
    const updatedSupplier: Supplier = await this.supplierService.update(
      +id,
      updateSupplierDto,
    );
    return new SupplierDto(updatedSupplier);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Fornecedor removido com sucesso.' })
  async remove(@Param('id') id: string): Promise<void> {
    const supplier: Supplier | null = await this.supplierService.findOne(+id);
    if (!supplier) throw new NotFoundException('Fornecedor não encontrado.');
    return await this.supplierService.remove(supplier);
  }
}
