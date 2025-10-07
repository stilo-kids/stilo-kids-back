import { Repository } from 'typeorm';
import { SupplierService } from './supplier.service';
import { Supplier } from '../entities/supplier.entity';
import { Address } from '../entities/address.entity';
import { Telephone } from '../entities/telephone.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import CreateSupplierDto from '../dto/create.supplier.dto';
import UpdateSupplierDto from '../dto/update.supplier.dto';
import { CreateSupplierAddressDto } from '../dto/create.supplier.address.dto';
import { CreateSupplierTelephoneDto } from '../dto/create.supplier.telephone.dto';

describe('SupplierService', () => {
  let service: SupplierService;
  let supplierRepository: jest.Mocked<Repository<Supplier>>;
  let addressRepository: jest.Mocked<Repository<Address>>;
  let telephoneRepository: jest.Mocked<Repository<Telephone>>;

  const mockAddress: Address = {
    id: 1,
    street: 'Rua das Flores',
    city: 'São Paulo',
    neighborhood: 'Jardim das Flores',
    number: '123',
    supplier: {} as Supplier,
    supplierId: 1,
    createdAt: new Date(),
    deletedAt: null,
  };

  const mockTelephone: Telephone = {
    id: 1,
    number: '+55 11 91234-5678',
    supplier: {} as Supplier,
    supplierId: 1,
    createdAt: new Date(),
    deletedAt: null,
  };

  const mockSupplier: Supplier = {
    id: 1,
    name: 'Fornecedor Teste',
    createdAt: new Date(),
    deletedAt: null,
    addresses: [mockAddress],
    telephones: [mockTelephone],
  };

  const mockSupplierWithoutRelations: Supplier = {
    id: 2,
    name: 'Fornecedor Sem Relações',
    createdAt: new Date(),
    deletedAt: null,
    addresses: [],
    telephones: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            softRemove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Address),
          useValue: {
            create: jest.fn(),
            softRemove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Telephone),
          useValue: {
            create: jest.fn(),
            softRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
    supplierRepository = module.get(getRepositoryToken(Supplier));
    addressRepository = module.get(getRepositoryToken(Address));
    telephoneRepository = module.get(getRepositoryToken(Telephone));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar um array de fornecedores com endereços e telefones', async () => {
      const expectedSuppliers = [mockSupplier];
      supplierRepository.find.mockResolvedValue(expectedSuppliers);

      const result = await service.findAll();

      expect(supplierRepository.find).toHaveBeenCalledWith({
        relations: {
          addresses: true,
          telephones: true,
        },
      });
      expect(result).toEqual(expectedSuppliers);
    });

    it('deve retornar um array vazio quando não há fornecedores', async () => {
      supplierRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(supplierRepository.find).toHaveBeenCalledWith({
        relations: {
          addresses: true,
          telephones: true,
        },
      });
      expect(result).toEqual([]);
    });

    it('deve retornar fornecedores sem endereços e telefones', async () => {
      const expectedSuppliers = [mockSupplierWithoutRelations];
      supplierRepository.find.mockResolvedValue(expectedSuppliers);

      const result = await service.findAll();

      expect(supplierRepository.find).toHaveBeenCalledWith({
        relations: {
          addresses: true,
          telephones: true,
        },
      });
      expect(result).toEqual(expectedSuppliers);
      expect(result[0].addresses).toEqual([]);
      expect(result[0].telephones).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar um fornecedor com endereços e telefones', async () => {
      const supplierId = 1;
      supplierRepository.findOneOrFail.mockResolvedValue(mockSupplier);

      const result = await service.findOne(supplierId);

      expect(supplierRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: supplierId },
        relations: {
          addresses: true,
          telephones: true,
        },
      });
      expect(result).toEqual(mockSupplier);
    });

    it('deve retornar um fornecedor sem endereços e telefones', async () => {
      const supplierId = 2;
      supplierRepository.findOneOrFail.mockResolvedValue(mockSupplierWithoutRelations);

      const result = await service.findOne(supplierId);

      expect(supplierRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: supplierId },
        relations: {
          addresses: true,
          telephones: true,
        },
      });
      expect(result).toEqual(mockSupplierWithoutRelations);
      expect(result?.addresses).toEqual([]);
      expect(result?.telephones).toEqual([]);
    });

    it('deve lançar erro quando fornecedor não é encontrado', async () => {
      const supplierId = 999;
      const error = new Error('EntityNotFound');
      supplierRepository.findOneOrFail.mockRejectedValue(error);

      await expect(service.findOne(supplierId)).rejects.toThrow(error);

      expect(supplierRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: supplierId },
        relations: {
          addresses: true,
          telephones: true,
        },
      });
    });
  });

  describe('create', () => {
    const createSupplierDto: CreateSupplierDto = {
      name: 'Novo Fornecedor',
      addresses: [
        {
          street: 'Rua Nova',
          city: 'São Paulo',
          neighborhood: 'Bairro Novo',
          number: '100',
        } as CreateSupplierAddressDto,
      ],
      telephones: [
        {
          number: '+55 11 99999-8888',
        } as CreateSupplierTelephoneDto,
      ],
    };

    it('deve criar um fornecedor com sucesso', async () => {
      const createdSupplier = { ...mockSupplier, name: createSupplierDto.name };
      supplierRepository.create.mockReturnValue(createdSupplier);
      supplierRepository.save.mockResolvedValue(createdSupplier);

      const result = await service.create(createSupplierDto);

      expect(supplierRepository.create).toHaveBeenCalledWith(createSupplierDto);
      expect(supplierRepository.save).toHaveBeenCalledWith(createdSupplier);
      expect(result).toEqual(createdSupplier);
    });

    it('deve criar um fornecedor apenas com nome', async () => {
      const minimalDto: CreateSupplierDto = {
        name: 'Fornecedor Mínimo',
        addresses: [],
        telephones: [],
      };
      const createdSupplier = { ...mockSupplierWithoutRelations, name: minimalDto.name };
      supplierRepository.create.mockReturnValue(createdSupplier);
      supplierRepository.save.mockResolvedValue(createdSupplier);

      const result = await service.create(minimalDto);

      expect(supplierRepository.create).toHaveBeenCalledWith(minimalDto);
      expect(supplierRepository.save).toHaveBeenCalledWith(createdSupplier);
      expect(result).toEqual(createdSupplier);
    });
  });

  describe('update', () => {
    const supplierId = 1;

    it('deve atualizar um fornecedor com sucesso sem alterar endereços e telefones', async () => {
      const updateSupplierDto: UpdateSupplierDto = {
        name: 'Fornecedor Atualizado',
      };
      const existingSupplier = { ...mockSupplier };
      const updatedSupplier = { ...existingSupplier, name: updateSupplierDto.name! };

      supplierRepository.findOne.mockResolvedValue(existingSupplier);
      supplierRepository.save.mockResolvedValue(updatedSupplier);

      const result = await service.update(supplierId, updateSupplierDto);

      expect(supplierRepository.findOne).toHaveBeenCalledWith({
        where: { id: supplierId },
        relations: { addresses: true, telephones: true },
      });
      expect(addressRepository.softRemove).not.toHaveBeenCalled();
      expect(telephoneRepository.softRemove).not.toHaveBeenCalled();
      expect(supplierRepository.save).toHaveBeenCalledWith({
        ...existingSupplier,
        name: updateSupplierDto.name,
      });
      expect(result).toEqual(updatedSupplier);
    });

    it('deve atualizar fornecedor removendo endereços antigos e adicionando novos', async () => {
      const newAddress: CreateSupplierAddressDto = {
        street: 'Rua Nova Atualizada',
        city: 'Rio de Janeiro',
        neighborhood: 'Bairro Novo',
        number: '200',
      };
      const updateSupplierDto: UpdateSupplierDto = {
        name: 'Fornecedor Atualizado',
        addresses: [newAddress],
      };
      const existingSupplier = { ...mockSupplier };
      const newAddressEntity = { ...mockAddress, ...newAddress };
      const updatedSupplier = {
        ...existingSupplier,
        name: updateSupplierDto.name!,
        addresses: [newAddressEntity],
      };

      supplierRepository.findOne.mockResolvedValue(existingSupplier);
      addressRepository.create.mockReturnValue(newAddressEntity);
      supplierRepository.save.mockResolvedValue(updatedSupplier);

      const result = await service.update(supplierId, updateSupplierDto);

      expect(supplierRepository.findOne).toHaveBeenCalledWith({
        where: { id: supplierId },
        relations: { addresses: true, telephones: true },
      });
      expect(addressRepository.softRemove).toHaveBeenCalledWith(expect.any(Array));
      expect(addressRepository.create).toHaveBeenCalledWith({
        ...newAddress,
        supplier: existingSupplier,
      });
      expect(supplierRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedSupplier);
    });

    it('deve atualizar fornecedor removendo telefones antigos e adicionando novos', async () => {
      const newTelephone: CreateSupplierTelephoneDto = {
        number: '+55 21 88888-7777',
      };
      const updateSupplierDto: UpdateSupplierDto = {
        name: 'Fornecedor Atualizado',
        telephones: [newTelephone],
      };
      const existingSupplier = { ...mockSupplier };
      const newTelephoneEntity = { ...mockTelephone, ...newTelephone };
      const updatedSupplier = {
        ...existingSupplier,
        name: updateSupplierDto.name!,
        telephones: [newTelephoneEntity],
      };

      supplierRepository.findOne.mockResolvedValue(existingSupplier);
      telephoneRepository.create.mockReturnValue(newTelephoneEntity);
      supplierRepository.save.mockResolvedValue(updatedSupplier);

      const result = await service.update(supplierId, updateSupplierDto);

      expect(supplierRepository.findOne).toHaveBeenCalledWith({
        where: { id: supplierId },
        relations: { addresses: true, telephones: true },
      });
      expect(telephoneRepository.softRemove).toHaveBeenCalledWith(expect.any(Array));
      expect(telephoneRepository.create).toHaveBeenCalledWith({
        ...newTelephone,
        supplier: existingSupplier,
      });
      expect(supplierRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedSupplier);
    });

    it('deve atualizar fornecedor limpando endereços existentes quando array vazio é fornecido', async () => {
      const updateSupplierDto: UpdateSupplierDto = {
        name: 'Fornecedor Sem Endereços',
        addresses: [],
      };
      const existingSupplier = { ...mockSupplier };
      const updatedSupplier = {
        ...existingSupplier,
        name: updateSupplierDto.name!,
        addresses: [],
      };

      supplierRepository.findOne.mockResolvedValue(existingSupplier);
      supplierRepository.save.mockResolvedValue(updatedSupplier);

      const result = await service.update(supplierId, updateSupplierDto);

      expect(addressRepository.softRemove).toHaveBeenCalledWith(expect.any(Array));
      expect(addressRepository.create).not.toHaveBeenCalled();
      expect(result.addresses).toEqual([]);
    });

    it('deve atualizar fornecedor limpando telefones existentes quando array vazio é fornecido', async () => {
      const updateSupplierDto: UpdateSupplierDto = {
        name: 'Fornecedor Sem Telefones',
        telephones: [],
      };
      const existingSupplier = { ...mockSupplier };
      const updatedSupplier = {
        ...existingSupplier,
        name: updateSupplierDto.name!,
        telephones: [],
      };

      supplierRepository.findOne.mockResolvedValue(existingSupplier);
      supplierRepository.save.mockResolvedValue(updatedSupplier);

      const result = await service.update(supplierId, updateSupplierDto);

      expect(telephoneRepository.softRemove).toHaveBeenCalledWith(expect.any(Array));
      expect(telephoneRepository.create).not.toHaveBeenCalled();
      expect(result.telephones).toEqual([]);
    });

    it('deve atualizar fornecedor substituindo todos os endereços e telefones', async () => {
      const newAddress: CreateSupplierAddressDto = {
        street: 'Rua Completamente Nova',
        city: 'Brasília',
        neighborhood: 'Asa Norte',
        number: '300',
      };
      const newTelephone: CreateSupplierTelephoneDto = {
        number: '+55 61 77777-6666',
      };
      const updateSupplierDto: UpdateSupplierDto = {
        name: 'Fornecedor Completamente Atualizado',
        addresses: [newAddress],
        telephones: [newTelephone],
      };
      const existingSupplier = { ...mockSupplier };
      const newAddressEntity = { ...mockAddress, ...newAddress };
      const newTelephoneEntity = { ...mockTelephone, ...newTelephone };
      const updatedSupplier = {
        ...existingSupplier,
        name: updateSupplierDto.name!,
        addresses: [newAddressEntity],
        telephones: [newTelephoneEntity],
      };

      supplierRepository.findOne.mockResolvedValue(existingSupplier);
      addressRepository.create.mockReturnValue(newAddressEntity);
      telephoneRepository.create.mockReturnValue(newTelephoneEntity);
      supplierRepository.save.mockResolvedValue(updatedSupplier);

      const result = await service.update(supplierId, updateSupplierDto);

      expect(addressRepository.softRemove).toHaveBeenCalledWith(expect.any(Array));
      expect(telephoneRepository.softRemove).toHaveBeenCalledWith(expect.any(Array));
      expect(addressRepository.create).toHaveBeenCalledWith({
        ...newAddress,
        supplier: existingSupplier,
      });
      expect(telephoneRepository.create).toHaveBeenCalledWith({
        ...newTelephone,
        supplier: existingSupplier,
      });
      expect(result).toEqual(updatedSupplier);
    });

    it('deve lançar erro quando fornecedor não é encontrado', async () => {
      const updateSupplierDto: UpdateSupplierDto = {
        name: 'Fornecedor Inexistente',
      };

      supplierRepository.findOne.mockResolvedValue(null);

      await expect(service.update(supplierId, updateSupplierDto)).rejects.toThrow('Supplier not found');

      expect(supplierRepository.findOne).toHaveBeenCalledWith({
        where: { id: supplierId },
        relations: { addresses: true, telephones: true },
      });
      expect(supplierRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover um fornecedor com sucesso (soft delete)', async () => {
      const supplierToRemove = { ...mockSupplier };
      supplierRepository.softRemove.mockResolvedValue(supplierToRemove);

      await service.remove(supplierToRemove);

      expect(supplierRepository.softRemove).toHaveBeenCalledWith(supplierToRemove);
    });

    it('deve lidar com erro durante remoção', async () => {
      const supplierToRemove = { ...mockSupplier };
      const error = new Error('Erro ao remover fornecedor');
      supplierRepository.softRemove.mockRejectedValue(error);

      await expect(service.remove(supplierToRemove)).rejects.toThrow(error);

      expect(supplierRepository.softRemove).toHaveBeenCalledWith(supplierToRemove);
    });
  });
});
