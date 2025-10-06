import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from '../dto/create.address.dto';
import { UpdateAddressDto } from '../dto/update.address.dto';
import { SupplierService } from './supplier.service';
import { Supplier } from '../entities/supplier.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly supplierService: SupplierService,
  ) {}

  findAll(): Promise<Array<Address>> {
    return this.addressRepository.find({
      relations: {
        supplier: true,
      },
    });
  }

  findOne(id: number): Promise<Address | null> {
    return this.addressRepository.findOneOrFail({
      where: { id: id },
      relations: {
        supplier: true,
      },
    });
  }

  /**
   * Cadastra um novo endereço associado a um fornecedor existente no banco.
   *
   * @param createAddressDto CreateAddressDto: Dados para criar um novo endereço.
   * @returns Promise<Address>: O endereço criado.
   * @throws Error: Se o fornecedor associado não for encontrado.
   */
  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const supplier: Supplier | null = await this.supplierService.findOne(
      createAddressDto.supplierId,
    );
    if (!supplier) throw new Error('Supplier not found');
    const address: Address = this.addressRepository.create(createAddressDto);
    address.supplier = supplier;
    return this.addressRepository.save(address);
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const supplier: Supplier | null = await this.supplierService.findOne(
      updateAddressDto.supplierId ?? 0,
    );
    if (!supplier) throw new Error('Supplier not found');

    const address: Address | null = await this.findOne(id);
    if (!address) throw new Error('Address not found');

    // Atualiza os campos do endereço com os dados fornecidos
    Object.assign(address, updateAddressDto);
    address.supplier = supplier;

    return this.addressRepository.save(address);
  }

  async remove(address: Address): Promise<void> {
    await this.addressRepository.softRemove(address);
  }
}
