import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Telephone } from '../entities/telephone.entity';
import { Supplier } from '../entities/supplier.entity';
import { SupplierService } from './supplier.service';
import { CreateTelephoneDto } from '../dto/create.telephone.dto';
import { UpdateTelephoneDto } from '../dto/update.telephone.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TelephoneService {
  constructor(
    @InjectRepository(Telephone)
    private readonly telephoneRepository: Repository<Telephone>,
    @InjectRepository(Supplier)
    private readonly supplierService: SupplierService,
  ) {}

  findAll(): Promise<Telephone[]> {
    return this.telephoneRepository.find({
      relations: {
        supplier: true,
      },
    });
  }

  findOne(id: number): Promise<Telephone | null> {
    return this.telephoneRepository.findOneOrFail({
      where: { id: id },
      relations: {
        supplier: true,
      },
    });
  }

  async create(createTelephoneDto: CreateTelephoneDto): Promise<Telephone> {
    const supplier: Supplier | null = await this.supplierService.findOne(
      createTelephoneDto.supplierId,
    );
    if (!supplier) throw new Error('Supplier not found');

    const telephone = this.telephoneRepository.create(createTelephoneDto);
    telephone.supplier = supplier;
    return this.telephoneRepository.save(telephone);
  }

  async update(
    id: number,
    updateTelephoneDto: UpdateTelephoneDto,
  ): Promise<Telephone> {
    const supplier: Supplier | null = await this.supplierService.findOne(
      updateTelephoneDto.supplierId ?? 0,
    );
    if (!supplier) throw new Error('Supplier not found');

    const telephone: Telephone | null = await this.findOne(id);
    if (!telephone) throw new Error('Telephone not found');

    // Atualiza os campos do telefone com os dados fornecidos
    Object.assign(telephone, updateTelephoneDto);
    telephone.supplier = supplier;

    return this.telephoneRepository.save(telephone);
  }

  async remove(telephone: Telephone): Promise<void> {
    await this.telephoneRepository.softRemove(telephone);
  }
}
