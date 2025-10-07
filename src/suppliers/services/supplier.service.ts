import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/supplier.entity';
import { Repository } from 'typeorm';
import CreateSupplierDto from '../dto/create.supplier.dto';
import UpdateSupplierDto from '../dto/update.supplier.dto';
import { Address } from '../entities/address.entity';
import { Telephone } from '../entities/telephone.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Telephone)
    private readonly telephoneRepository: Repository<Telephone>,
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
    return this.supplierRepository.save(supplier);
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: { addresses: true, telephones: true },
    });

    if (!supplier) throw new Error('Supplier not found');

    if (updateSupplierDto.addresses !== undefined) {
      await this.addressRepository.softRemove(supplier.addresses);
      supplier.addresses = [];
      supplier.addresses = (updateSupplierDto.addresses || []).map((address) =>
        this.addressRepository.create({ ...address, supplier }),
      );
    }

    if (updateSupplierDto.telephones !== undefined) {
      await this.telephoneRepository.softRemove(supplier.telephones);
      supplier.telephones = [];
      supplier.telephones = (updateSupplierDto.telephones || []).map(
        (telephone) =>
          this.telephoneRepository.create({ ...telephone, supplier }),
      );
    }

    Object.assign(supplier, updateSupplierDto);

    return this.supplierRepository.save(supplier);
  }

  async remove(supplier: Supplier): Promise<void> {
    await this.supplierRepository.softRemove(supplier);
  }
}
