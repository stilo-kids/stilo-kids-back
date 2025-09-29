import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/supplier.entity';
import { Repository } from 'typeorm';
import CreateSupplierDto from '../dto/create.supplier.dto';
import UpdateSupplierDto from '../dto/update.supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find({
      relations: {
        addresses: true,
        telephones: true,
      },
    });
  }

  findOne(id: number): Promise<Supplier | null> {
    return this.supplierRepository.findOneOrFail({
      where: { id: id },
      relations: {
        addresses: true,
        telephones: true,
      },
    });
  }

  create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.supplierRepository.create(createSupplierDto);
    // const supplier = this.supplierRepository.create({
    //   ...createSupplierDto,
    // });
    return this.supplierRepository.save(supplier);
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    return this.supplierRepository.save({ id, ...updateSupplierDto });
  }

  async remove(supplier: Supplier): Promise<void> {
    await this.supplierRepository.softRemove(supplier);
  }
}
