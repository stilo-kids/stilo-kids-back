import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../entities/brand.entity';
import { Repository } from 'typeorm';
import CreateBrandDto from '../dto/create.brand.dto';
import UpdateBrandDto from '../dto/update.brand.dto';

@Injectable()
export class BrandService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
    ) {}

    findAll(): Promise<Brand[]> {
        return this.brandRepository.find();
    }

    findOne(id: number): Promise<Brand | null> {
        return this.brandRepository.findOneOrFail({
            where: { id: id },
        });
    }

    create(createBrandDto: CreateBrandDto): Promise<Brand> {
        const brand = this.brandRepository.create(createBrandDto);
        return this.brandRepository.save(brand);
    }

    async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
        const brand = await this.brandRepository.findOne({
            where: { id },
        });

        if (!brand) throw new Error('Brand not found');

        Object.assign(brand, updateBrandDto);
        return this.brandRepository.save(brand);
    }

    async remove(brand: Brand): Promise<void> {
        await this.brandRepository.softRemove(brand);
    }
}