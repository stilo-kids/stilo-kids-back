import { Test, TestingModule } from '@nestjs/testing';
import { SupplierController } from './supplier.controller';
import { SupplierService } from '../services/supplier.service';
import CreateSupplierDto from '../dto/create.supplier.dto';
import UpdateSupplierDto from '../dto/update.supplier.dto';
import SupplierDto from '../dto/supplier.dto';
import { Supplier } from '../entities/supplier.entity';
import { Address } from '../entities/address.entity';
import { Telephone } from '../entities/telephone.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateSupplierAddressDto } from '../dto/create.supplier.address.dto';
import { CreateSupplierTelephoneDto } from '../dto/create.supplier.telephone.dto';

describe('SupplierController', () => {
  let controller: SupplierController;
  let supplierService: jest.Mocked<SupplierService>;

  const mockAddress: Address = {
    id: 1,
    street: 'Rua das Flores',
    city: 'São Paulo',
    neighborhood: 'Jardim das Flores',
    number: '123',
    supplier: {} as Supplier,
    supplierId: 1,
    createdAt: new Date('2023-01-01'),
    deletedAt: null,
  };

  const mockTelephone: Telephone = {
    id: 1,
    number: '+55 11 91234-5678',
    supplier: {} as Supplier,
    supplierId: 1,
    createdAt: new Date('2023-01-01'),
    deletedAt: null,
  };

  const mockSupplier: Supplier = {
    id: 1,
    name: 'Fornecedor Teste',
    createdAt: new Date('2023-01-01'),
    deletedAt: null,
    addresses: [mockAddress],
    telephones: [mockTelephone],
  };

  const mockSupplier2: Supplier = {
    id: 2,
    name: 'Segundo Fornecedor',
    createdAt: new Date('2023-01-02'),
    deletedAt: null,
    addresses: [],
    telephones: [],
  };

  const mockSupplierWithoutRelations: Supplier = {
    id: 3,
    name: 'Fornecedor Sem Relações',
    createdAt: new Date('2023-01-03'),
    deletedAt: null,
    addresses: [],
    telephones: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        {
          provide: SupplierService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SupplierController>(SupplierController);
    supplierService = module.get(SupplierService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar um array de SupplierDto quando há fornecedores', async () => {
      const mockSuppliers = [mockSupplier, mockSupplier2];
      supplierService.findAll.mockResolvedValue(mockSuppliers);

      const result = await controller.findAll();

      expect(supplierService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(SupplierDto);
      expect(result[0].id).toBe(mockSupplier.id);
      expect(result[0].name).toBe(mockSupplier.name);
      expect(result[0].addresses).toHaveLength(1);
      expect(result[0].telephones).toHaveLength(1);
      expect(result[1]).toBeInstanceOf(SupplierDto);
      expect(result[1].id).toBe(mockSupplier2.id);
      expect(result[1].addresses).toHaveLength(0);
      expect(result[1].telephones).toHaveLength(0);
    });

    it('deve retornar um array vazio quando não há fornecedores', async () => {
      supplierService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(supplierService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('deve propagar erro do serviço', async () => {
      const error = new Error('Database error');
      supplierService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
      expect(supplierService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    const validCreateSupplierDto: CreateSupplierDto = {
      name: 'Novo Fornecedor',
      addresses: [
        {
          street: 'Rua Nova',
          city: 'Rio de Janeiro',
          neighborhood: 'Copacabana',
          number: '100',
        } as CreateSupplierAddressDto,
      ],
      telephones: [
        {
          number: '+55 21 99999-8888',
        } as CreateSupplierTelephoneDto,
      ],
    };

    it('deve criar um fornecedor com dados válidos', async () => {
      const createdSupplier = { ...mockSupplier, name: validCreateSupplierDto.name };
      supplierService.create.mockResolvedValue(createdSupplier);

      const result = await controller.create(validCreateSupplierDto);

      expect(supplierService.create).toHaveBeenCalledWith(validCreateSupplierDto);
      expect(supplierService.create).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(SupplierDto);
      expect(result.id).toBe(createdSupplier.id);
      expect(result.name).toBe(createdSupplier.name);
      expect(result.addresses).toBeDefined();
      expect(result.telephones).toBeDefined();
    });

    it('deve criar um fornecedor apenas com nome', async () => {
      const minimalDto: CreateSupplierDto = {
        name: 'Fornecedor Mínimo',
        addresses: [],
        telephones: [],
      };
      const createdSupplier = { ...mockSupplierWithoutRelations, name: minimalDto.name };
      supplierService.create.mockResolvedValue(createdSupplier);

      const result = await controller.create(minimalDto);

      expect(supplierService.create).toHaveBeenCalledWith(minimalDto);
      expect(supplierService.create).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(SupplierDto);
      expect(result.name).toBe(minimalDto.name);
      expect(result.addresses).toHaveLength(0);
      expect(result.telephones).toHaveLength(0);
    });

    it('deve propagar erro do serviço', async () => {
      const error = new Error('Database error');
      supplierService.create.mockRejectedValue(error);

      await expect(controller.create(validCreateSupplierDto)).rejects.toThrow(error);
      expect(supplierService.create).toHaveBeenCalledWith(validCreateSupplierDto);
      expect(supplierService.create).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de validação para nome vazio', async () => {
      const invalidDto = { ...validCreateSupplierDto, name: '' };
      const error = new Error('O nome do fornecedor não pode estar vazio.');
      supplierService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para nome muito curto', async () => {
      const invalidDto = { ...validCreateSupplierDto, name: 'AB' };
      const error = new Error('O nome do fornecedor deve ter entre 3 e 200 caracteres.');
      supplierService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para nome muito longo', async () => {
      const invalidDto = { ...validCreateSupplierDto, name: 'A'.repeat(201) };
      const error = new Error('O nome do fornecedor deve ter entre 3 e 200 caracteres.');
      supplierService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para nome não string', async () => {
      const invalidDto = { ...validCreateSupplierDto, name: 123 as any };
      const error = new Error('O nome do fornecedor deve ser um texto.');
      supplierService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação aninhada para endereço inválido', async () => {
      const invalidDto = {
        ...validCreateSupplierDto,
        addresses: [{ street: 'AB', city: 'SP', neighborhood: 'Centro', number: '1' }] as any,
      };
      const error = new Error('O logradouro deve ter entre 3 e 220 caracteres.');
      supplierService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação aninhada para telefone inválido', async () => {
      const invalidDto = {
        ...validCreateSupplierDto,
        telephones: [{ number: 'invalid' }] as any,
      };
      const error = new Error('O telefone deve estar no formato +55 XX 9XXXX-XXXX');
      supplierService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('deve retornar um SupplierDto quando fornecedor existe', async () => {
      supplierService.findOne.mockResolvedValue(mockSupplier);

      const result = await controller.findOne('1');

      expect(supplierService.findOne).toHaveBeenCalledWith(1);
      expect(supplierService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(SupplierDto);
      expect(result.id).toBe(mockSupplier.id);
      expect(result.name).toBe(mockSupplier.name);
      expect(result.addresses).toHaveLength(1);
      expect(result.telephones).toHaveLength(1);
    });

    it('deve retornar um SupplierDto sem endereços e telefones', async () => {
      supplierService.findOne.mockResolvedValue(mockSupplierWithoutRelations);

      const result = await controller.findOne('3');

      expect(supplierService.findOne).toHaveBeenCalledWith(3);
      expect(supplierService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(SupplierDto);
      expect(result.id).toBe(mockSupplierWithoutRelations.id);
      expect(result.addresses).toHaveLength(0);
      expect(result.telephones).toHaveLength(0);
    });

    it('deve lançar NotFoundException quando fornecedor não existe', async () => {
      supplierService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(controller.findOne('999')).rejects.toThrow('Fornecedor não encontrado.');
      expect(supplierService.findOne).toHaveBeenCalledWith(999);
      expect(supplierService.findOne).toHaveBeenCalledTimes(2);
    });

    it('deve propagar erro do serviço', async () => {
      const error = new Error('Database error');
      supplierService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('1')).rejects.toThrow(error);
      expect(supplierService.findOne).toHaveBeenCalledWith(1);
      expect(supplierService.findOne).toHaveBeenCalledTimes(1);
    });

    it('deve converter string id para number', async () => {
      supplierService.findOne.mockResolvedValue(mockSupplier);

      await controller.findOne('123');

      expect(supplierService.findOne).toHaveBeenCalledWith(123);
    });
  });

  describe('update', () => {
    const validUpdateSupplierDto: UpdateSupplierDto = {
      name: 'Fornecedor Atualizado',
      addresses: [
        {
          street: 'Rua Atualizada',
          city: 'Brasília',
          neighborhood: 'Asa Norte',
          number: '200',
        } as CreateSupplierAddressDto,
      ],
      telephones: [
        {
          number: '+55 61 88888-7777',
        } as CreateSupplierTelephoneDto,
      ],
    };

    const updatedSupplier: Supplier = {
      ...mockSupplier,
      name: validUpdateSupplierDto.name!,
    };

    it('deve atualizar um fornecedor com dados válidos', async () => {
      supplierService.findOne.mockResolvedValue(mockSupplier);
      supplierService.update.mockResolvedValue(updatedSupplier);

      const result = await controller.update('1', validUpdateSupplierDto);

      expect(supplierService.findOne).toHaveBeenCalledWith(1);
      expect(supplierService.findOne).toHaveBeenCalledTimes(1);
      expect(supplierService.update).toHaveBeenCalledWith(1, validUpdateSupplierDto);
      expect(supplierService.update).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(SupplierDto);
      expect(result.id).toBe(updatedSupplier.id);
      expect(result.name).toBe(validUpdateSupplierDto.name);
    });

    it('deve atualizar fornecedor apenas com nome (sem tocar endereços/telefones)', async () => {
      const partialUpdateDto: UpdateSupplierDto = {
        name: 'Apenas Nome Atualizado',
      };
      const partiallyUpdatedSupplier: Supplier = {
        ...mockSupplier,
        name: partialUpdateDto.name!,
      };

      supplierService.findOne.mockResolvedValue(mockSupplier);
      supplierService.update.mockResolvedValue(partiallyUpdatedSupplier);

      const result = await controller.update('1', partialUpdateDto);

      expect(supplierService.findOne).toHaveBeenCalledWith(1);
      expect(supplierService.update).toHaveBeenCalledWith(1, partialUpdateDto);
      expect(result).toBeInstanceOf(SupplierDto);
      expect(result.name).toBe(partialUpdateDto.name);
      // Verifica que mantém endereços/telefones originais
      expect(result.addresses).toHaveLength(1);
      expect(result.telephones).toHaveLength(1);
    });

    it('deve atualizar fornecedor substituindo endereços (soft remove + criação)', async () => {
      const updateDtoWithNewAddresses: UpdateSupplierDto = {
        name: 'Fornecedor Com Novos Endereços',
        addresses: [
          {
            street: 'Nova Rua 1',
            city: 'São Paulo',
            neighborhood: 'Novo Bairro 1',
            number: '300',
          } as CreateSupplierAddressDto,
          {
            street: 'Nova Rua 2',
            city: 'Rio de Janeiro',
            neighborhood: 'Novo Bairro 2',
            number: '400',
          } as CreateSupplierAddressDto,
        ],
      };
      const updatedSupplierWithNewAddresses: Supplier = {
        ...mockSupplier,
        name: updateDtoWithNewAddresses.name!,
        // Simula novos endereços criados
        addresses: [
          { ...mockAddress, street: 'Nova Rua 1', number: '300' },
          { ...mockAddress, id: 2, street: 'Nova Rua 2', number: '400' },
        ],
      };

      supplierService.findOne.mockResolvedValue(mockSupplier);
      supplierService.update.mockResolvedValue(updatedSupplierWithNewAddresses);

      const result = await controller.update('1', updateDtoWithNewAddresses);

      expect(supplierService.findOne).toHaveBeenCalledWith(1);
      expect(supplierService.update).toHaveBeenCalledWith(1, updateDtoWithNewAddresses);
      expect(result).toBeInstanceOf(SupplierDto);
      expect(result.addresses).toHaveLength(2);
      expect(result.addresses[0].street).toBe('Nova Rua 1');
      expect(result.addresses[1].street).toBe('Nova Rua 2');
    });

    it('deve atualizar fornecedor substituindo telefones (soft remove + criação)', async () => {
      const updateDtoWithNewTelephones: UpdateSupplierDto = {
        name: 'Fornecedor Com Novos Telefones',
        telephones: [
          {
            number: '+55 11 99999-1111',
          } as CreateSupplierTelephoneDto,
          {
            number: '+55 21 99999-2222',
          } as CreateSupplierTelephoneDto,
        ],
      };
      const updatedSupplierWithNewTelephones: Supplier = {
        ...mockSupplier,
        name: updateDtoWithNewTelephones.name!,
        // Simula novos telefones criados
        telephones: [
          { ...mockTelephone, number: '+55 11 99999-1111' },
          { ...mockTelephone, id: 2, number: '+55 21 99999-2222' },
        ],
      };

      supplierService.findOne.mockResolvedValue(mockSupplier);
      supplierService.update.mockResolvedValue(updatedSupplierWithNewTelephones);

      const result = await controller.update('1', updateDtoWithNewTelephones);

      expect(supplierService.findOne).toHaveBeenCalledWith(1);
      expect(supplierService.update).toHaveBeenCalledWith(1, updateDtoWithNewTelephones);
      expect(result).toBeInstanceOf(SupplierDto);
      expect(result.telephones).toHaveLength(2);
      expect(result.telephones[0].number).toBe('+55 11 99999-1111');
      expect(result.telephones[1].number).toBe('+55 21 99999-2222');
    });

    it('deve atualizar fornecedor removendo todos os endereços (array vazio)', async () => {
      const updateDtoWithEmptyAddresses: UpdateSupplierDto = {
        name: 'Fornecedor Sem Endereços',
        addresses: [],
      };
      const updatedSupplierWithoutAddresses: Supplier = {
        ...mockSupplier,
        name: updateDtoWithEmptyAddresses.name!,
        addresses: [], // Todos removidos
      };

      supplierService.findOne.mockResolvedValue(mockSupplier);
      supplierService.update.mockResolvedValue(updatedSupplierWithoutAddresses);

      const result = await controller.update('1', updateDtoWithEmptyAddresses);

      expect(supplierService.update).toHaveBeenCalledWith(1, updateDtoWithEmptyAddresses);
      expect(result.addresses).toHaveLength(0);
    });

    it('deve atualizar fornecedor removendo todos os telefones (array vazio)', async () => {
      const updateDtoWithEmptyTelephones: UpdateSupplierDto = {
        name: 'Fornecedor Sem Telefones',
        telephones: [],
      };
      const updatedSupplierWithoutTelephones: Supplier = {
        ...mockSupplier,
        name: updateDtoWithEmptyTelephones.name!,
        telephones: [], // Todos removidos
      };

      supplierService.findOne.mockResolvedValue(mockSupplier);
      supplierService.update.mockResolvedValue(updatedSupplierWithoutTelephones);

      const result = await controller.update('1', updateDtoWithEmptyTelephones);

      expect(supplierService.update).toHaveBeenCalledWith(1, updateDtoWithEmptyTelephones);
      expect(result.telephones).toHaveLength(0);
    });

    it('deve lançar NotFoundException quando fornecedor não existe', async () => {
      supplierService.findOne.mockResolvedValue(null);

      await expect(controller.update('999', validUpdateSupplierDto)).rejects.toThrow(NotFoundException);
      await expect(controller.update('999', validUpdateSupplierDto)).rejects.toThrow('Fornecedor não encontrado.');
      expect(supplierService.findOne).toHaveBeenCalledWith(999);
      expect(supplierService.findOne).toHaveBeenCalledTimes(2);
      expect(supplierService.update).not.toHaveBeenCalled();
    });

    it('deve propagar erro do serviço no update', async () => {
      const error = new Error('Update error');
      supplierService.findOne.mockResolvedValue(mockSupplier);
      supplierService.update.mockRejectedValue(error);

      await expect(controller.update('1', validUpdateSupplierDto)).rejects.toThrow(error);
      expect(supplierService.findOne).toHaveBeenCalledWith(1);
      expect(supplierService.update).toHaveBeenCalledWith(1, validUpdateSupplierDto);
    });

    it('deve propagar erro de validação para dados inválidos', async () => {
      const invalidDto = { ...validUpdateSupplierDto, name: 'AB' };
      const error = new Error('O nome do fornecedor deve ter entre 3 e 200 caracteres.');
      supplierService.findOne.mockResolvedValue(mockSupplier);
      supplierService.update.mockRejectedValue(error);

      await expect(controller.update('1', invalidDto)).rejects.toThrow(error);
    });

    it('deve converter string id para number', async () => {
      supplierService.findOne.mockResolvedValue(mockSupplier);
      supplierService.update.mockResolvedValue(updatedSupplier);

      await controller.update('123', validUpdateSupplierDto);

      expect(supplierService.findOne).toHaveBeenCalledWith(123);
      expect(supplierService.update).toHaveBeenCalledWith(123, validUpdateSupplierDto);
    });
  });

  describe('remove', () => {
    it('deve remover um fornecedor que existe', async () => {
      supplierService.findOne.mockResolvedValue(mockSupplier);
      supplierService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(supplierService.findOne).toHaveBeenCalledWith(1);
      expect(supplierService.findOne).toHaveBeenCalledTimes(1);
      expect(supplierService.remove).toHaveBeenCalledWith(mockSupplier);
      expect(supplierService.remove).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('deve lançar NotFoundException quando fornecedor não existe', async () => {
      supplierService.findOne.mockResolvedValue(null);

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      await expect(controller.remove('999')).rejects.toThrow('Fornecedor não encontrado.');
      expect(supplierService.findOne).toHaveBeenCalledWith(999);
      expect(supplierService.findOne).toHaveBeenCalledTimes(2);
      expect(supplierService.remove).not.toHaveBeenCalled();
    });

    it('deve propagar erro do serviço no findOne', async () => {
      const error = new Error('Database error');
      supplierService.findOne.mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow(error);
      expect(supplierService.findOne).toHaveBeenCalledWith(1);
      expect(supplierService.findOne).toHaveBeenCalledTimes(1);
      expect(supplierService.remove).not.toHaveBeenCalled();
    });

    it('deve propagar erro do serviço no remove', async () => {
      const error = new Error('Delete error');
      supplierService.findOne.mockResolvedValue(mockSupplier);
      supplierService.remove.mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow(error);
      expect(supplierService.findOne).toHaveBeenCalledWith(1);
      expect(supplierService.remove).toHaveBeenCalledWith(mockSupplier);
    });

    it('deve converter string id para number', async () => {
      supplierService.findOne.mockResolvedValue(mockSupplier);
      supplierService.remove.mockResolvedValue(undefined);

      await controller.remove('123');

      expect(supplierService.findOne).toHaveBeenCalledWith(123);
    });
  });
});
