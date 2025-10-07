import { Repository } from 'typeorm';
import { AddressService } from './address.service';
import { Supplier } from '../entities/supplier.entity';
import { Address } from '../entities/address.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupplierService } from './supplier.service';
import { CreateAddressDto } from '../dto/create.address.dto';
import { UpdateAddressDto } from '../dto/update.address.dto';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: jest.Mocked<Repository<Address>>;
  let supplierRepository: jest.Mocked<Repository<Supplier>>;

  const mockSupplier: Supplier = {
    id: 1,
    name: 'Fornecedor Teste',
    createdAt: new Date(),
    deletedAt: null,
    addresses: [],
    telephones: [],
  };

  const mockAddress: Address = {
    id: 1,
    street: 'Rua das Flores',
    city: 'São Paulo',
    neighborhood: 'Jardim das Flores',
    number: '123',
    supplier: mockSupplier,
    supplierId: 1,
    createdAt: new Date(),
    deletedAt: null,
  };

  const mockAddressWithoutSupplier: Address = {
    id: 2,
    street: 'Rua das Rosas',
    city: 'Rio de Janeiro',
    neighborhood: 'Copacabana',
    number: '456',
    supplier: {} as Supplier,
    supplierId: 2,
    createdAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(Address),
          useValue: {
            find: jest.fn(),
            findOneOrFail: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            softRemove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Supplier),
          useValue: {
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    addressRepository = module.get(getRepositoryToken(Address));
    supplierRepository = module.get(getRepositoryToken(Supplier));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar um array de endereços com relacionamento supplier', async () => {
      const expectedAddresses = [mockAddress];
      addressRepository.find.mockResolvedValue(expectedAddresses);

      const result = await service.findAll();

      expect(addressRepository.find).toHaveBeenCalledWith({
        relations: {
          supplier: true,
        },
      });
      expect(result).toEqual(expectedAddresses);
    });

    it('deve retornar um array vazio quando não há endereços', async () => {
      addressRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(addressRepository.find).toHaveBeenCalledWith({
        relations: {
          supplier: true,
        },
      });
      expect(result).toEqual([]);
    });

    it('deve retornar endereços com supplier vazio', async () => {
      const expectedAddresses = [mockAddressWithoutSupplier];
      addressRepository.find.mockResolvedValue(expectedAddresses);

      const result = await service.findAll();

      expect(addressRepository.find).toHaveBeenCalledWith({
        relations: {
          supplier: true,
        },
      });
      expect(result).toEqual(expectedAddresses);
      expect(result[0].supplier).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('deve retornar um endereço com relacionamento supplier', async () => {
      const addressId = 1;
      addressRepository.findOneOrFail.mockResolvedValue(mockAddress);

      const result = await service.findOne(addressId);

      expect(addressRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: addressId },
        relations: {
          supplier: true,
        },
      });
      expect(result).toEqual(mockAddress);
    });

    it('deve retornar um endereço com supplier vazio', async () => {
      const addressId = 2;
      addressRepository.findOneOrFail.mockResolvedValue(mockAddressWithoutSupplier);

      const result = await service.findOne(addressId);

      expect(addressRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: addressId },
        relations: {
          supplier: true,
        },
      });
      expect(result).toEqual(mockAddressWithoutSupplier);
      expect(result?.supplier).toBeDefined();
    });

    it('deve lançar erro quando endereço não é encontrado', async () => {
      const addressId = 999;
      const error = new Error('EntityNotFound');
      addressRepository.findOneOrFail.mockRejectedValue(error);

      await expect(service.findOne(addressId)).rejects.toThrow(error);

      expect(addressRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: addressId },
        relations: {
          supplier: true,
        },
      });
    });
  });

  describe('create', () => {
    const createAddressDto: CreateAddressDto = {
      street: 'Rua das Flores',
      city: 'São Paulo',
      neighborhood: 'Jardim das Flores',
      number: '123',
      supplierId: 1,
    };

    it('deve criar um endereço com sucesso', async () => {
      const createdAddress = { ...mockAddress };
      supplierRepository.findOne.mockResolvedValue(mockSupplier);
      addressRepository.create.mockReturnValue(createdAddress);
      addressRepository.save.mockResolvedValue(createdAddress);

      const result = await service.create(createAddressDto);

      expect(supplierRepository.findOne).toHaveBeenCalledWith(createAddressDto.supplierId);
      expect(addressRepository.create).toHaveBeenCalledWith(createAddressDto);
      expect(addressRepository.save).toHaveBeenCalledWith({
        ...createdAddress,
        supplier: mockSupplier,
      });
      expect(result).toEqual(createdAddress);
    });

    it('deve lançar erro quando fornecedor não é encontrado', async () => {
      supplierRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createAddressDto)).rejects.toThrow('Supplier not found');

      expect(supplierRepository.findOne).toHaveBeenCalledWith(createAddressDto.supplierId);
      expect(addressRepository.create).not.toHaveBeenCalled();
      expect(addressRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const addressId = 1;
    const updateAddressDto: UpdateAddressDto = {
      street: 'Rua das Rosas Atualizada',
      city: 'São Paulo',
      neighborhood: 'Jardim das Rosas',
      number: '456',
      supplierId: 1,
    };

    it('deve atualizar um endereço com sucesso', async () => {
      const existingAddress = { ...mockAddress };
      const updatedAddress = { ...existingAddress, ...updateAddressDto, supplier: mockSupplier };
      
      supplierRepository.findOne.mockResolvedValue(mockSupplier);
      jest.spyOn(service, 'findOne').mockResolvedValue(existingAddress);
      addressRepository.save.mockResolvedValue(updatedAddress);

      const result = await service.update(addressId, updateAddressDto);

      expect(supplierRepository.findOne).toHaveBeenCalledWith(updateAddressDto.supplierId);
      expect(service.findOne).toHaveBeenCalledWith(addressId);
      expect(addressRepository.save).toHaveBeenCalledWith({
        ...existingAddress,
        ...updateAddressDto,
        supplier: mockSupplier,
      });
      expect(result).toEqual(updatedAddress);
    });

    it('deve atualizar endereço quando supplierId não é fornecido', async () => {
      const updateDtoWithoutSupplierId: UpdateAddressDto = {
        street: 'Rua Atualizada',
      };
      const existingAddress = { ...mockAddress };
      
      supplierRepository.findOne.mockResolvedValue(null);

      await expect(service.update(addressId, updateDtoWithoutSupplierId)).rejects.toThrow('Supplier not found');

      expect(supplierRepository.findOne).toHaveBeenCalledWith(0);
    });

    it('deve lançar erro quando fornecedor não é encontrado', async () => {
      supplierRepository.findOne.mockResolvedValue(null);

      await expect(service.update(addressId, updateAddressDto)).rejects.toThrow('Supplier not found');

      expect(supplierRepository.findOne).toHaveBeenCalledWith(updateAddressDto.supplierId);
      expect(addressRepository.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando endereço não é encontrado', async () => {
      const error = new Error('Address not found');
      supplierRepository.findOne.mockResolvedValue(mockSupplier);
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      await expect(service.update(addressId, updateAddressDto)).rejects.toThrow(error);

      expect(supplierRepository.findOne).toHaveBeenCalledWith(updateAddressDto.supplierId);
      expect(service.findOne).toHaveBeenCalledWith(addressId);
      expect(addressRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover um endereço com sucesso (soft delete)', async () => {
      const addressToRemove = { ...mockAddress };
      addressRepository.softRemove.mockResolvedValue(addressToRemove);

      await service.remove(addressToRemove);

      expect(addressRepository.softRemove).toHaveBeenCalledWith(addressToRemove);
    });

    it('deve lidar com erro durante remoção', async () => {
      const addressToRemove = { ...mockAddress };
      const error = new Error('Erro ao remover endereço');
      addressRepository.softRemove.mockRejectedValue(error);

      await expect(service.remove(addressToRemove)).rejects.toThrow(error);

      expect(addressRepository.softRemove).toHaveBeenCalledWith(addressToRemove);
    });
  });
});
