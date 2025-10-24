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
import { BrandService } from '../services/brand.service';
import { Brand } from '../entities/brand.entity';
import CreateBrandDto from '../dto/create.brand.dto';
import BrandDto from '../dto/brand.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import UpdateBrandDto from '../dto/update.brand.dto';

@ApiTags('Marcas')
@Controller('brands')
export class BrandController {
    constructor(
        private readonly brandService: BrandService,
    ) {}

    @Get()
    @ApiOkResponse({
        description: 'Lista de marcas retornada com sucesso.',
        type: [BrandDto],
    })
    async findAll(): Promise<Array<BrandDto>> {
        const brands: Brand[] = await this.brandService.findAll();
        return brands.map((brand) => new BrandDto(brand));
    }

    @Post()
    @ApiCreatedResponse({
        description: 'Marca criada com sucesso.',
        type: BrandDto,
    })
    async create(
        @Body() createBrandDto: CreateBrandDto,
    ): Promise<BrandDto> {
        const brand: Brand = await this.brandService.create(createBrandDto);
        return new BrandDto(brand);
    }

    @Get(':id')
    @ApiOkResponse({
        description: 'Marca retornada com sucesso.',
        type: BrandDto,
    })
    async findOne(@Param('id') id: string): Promise<BrandDto> {
        const brand: Brand | null = await this.brandService.findOne(+id);
        if (!brand) throw new NotFoundException('Marca não encontrada.');
        return new BrandDto(brand);
    }

    @Put(':id')
    @ApiOkResponse({
        description: 'Marca atualizada com sucesso.',
        type: BrandDto,
    })
    async update(
        @Param('id') id: string,
        @Body() updateBrandDto: UpdateBrandDto,
    ): Promise<BrandDto> {
        const brand: Brand | null = await this.brandService.findOne(+id);
        if (!brand) throw new NotFoundException('Marca não encontrada.');
        const updatedBrand: Brand = await this.brandService.update(
            +id,
            updateBrandDto,
        );
        return new BrandDto(updatedBrand);
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'Marca removida com sucesso.' })
    async remove(@Param('id') id: string): Promise<void> {
        const brand: Brand | null = await this.brandService.findOne(+id);
        if (!brand) throw new NotFoundException('Marca não encontrada.');
        return await this.brandService.remove(brand);
    }
}