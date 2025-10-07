import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dto/create.address.dto';
import { UpdateAddressDto } from '../dto/update.address.dto';
import AddressDto from '../dto/address.dto';
import { Address } from '../entities/address.entity';
import { Supplier } from '../entities/supplier.entity';
import { NotFoundException } from '@nestjs/common';

describe('AddressController', () => {
  let controller: AddressController;
  let addressService: jest.Mocked<AddressService>;

  const mockSupplier: Supplier = {
    id: 1,
    name: 'Fornecedor Teste',
    createdAt: new Date('2023-01-01'),
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
    createdAt: new Date('2023-01-01'),
    deletedAt: null,
  };

  const mockAddress2: Address = {
    id: 2,
    street: 'Av. Paulista',
    city: 'São Paulo',
    neighborhood: 'Bela Vista',
    number: '1000',
    supplier: mockSupplier,
    supplierId: 1,
    createdAt: new Date('2023-01-02'),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
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

    controller = module.get<AddressController>(AddressController);
    addressService = module.get(AddressService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar um array de AddressDto quando há endereços', async () => {
      const mockAddresses = [mockAddress, mockAddress2];
      addressService.findAll.mockResolvedValue(mockAddresses);

      const result = await controller.findAll();

      expect(addressService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(AddressDto);
      expect(result[0].id).toBe(mockAddress.id);
      expect(result[0].street).toBe(mockAddress.street);
      expect(result[0].city).toBe(mockAddress.city);
      expect(result[1]).toBeInstanceOf(AddressDto);
      expect(result[1].id).toBe(mockAddress2.id);
    });

    it('deve retornar um array vazio quando não há endereços', async () => {
      addressService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(addressService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('deve propagar erro do serviço', async () => {
      const error = new Error('Database error');
      addressService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
      expect(addressService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    const validCreateAddressDto: CreateAddressDto = {
      street: 'Rua das Flores',
      city: 'São Paulo',
      neighborhood: 'Jardim das Flores',
      number: '123',
      supplierId: 1,
    };

    it('deve criar um endereço com dados válidos', async () => {
      addressService.create.mockResolvedValue(mockAddress);

      const result = await controller.create(validCreateAddressDto);

      expect(addressService.create).toHaveBeenCalledWith(validCreateAddressDto);
      expect(addressService.create).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(AddressDto);
      expect(result.id).toBe(mockAddress.id);
      expect(result.street).toBe(mockAddress.street);
      expect(result.city).toBe(mockAddress.city);
      expect(result.neighborhood).toBe(mockAddress.neighborhood);
      expect(result.number).toBe(mockAddress.number);
      expect(result.supplierId).toBe(mockAddress.supplierId);
    });

    it('deve propagar erro quando fornecedor não existe', async () => {
      const error = new Error('Supplier not found');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(validCreateAddressDto)).rejects.toThrow(error);
      expect(addressService.create).toHaveBeenCalledWith(validCreateAddressDto);
      expect(addressService.create).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de validação para street vazio', async () => {
      const invalidDto = { ...validCreateAddressDto, street: '' };
      const error = new Error('O logradouro não pode estar vazio.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para street muito curto', async () => {
      const invalidDto = { ...validCreateAddressDto, street: 'AB' };
      const error = new Error('O logradouro deve ter entre 3 e 220 caracteres.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para street muito longo', async () => {
      const invalidDto = { ...validCreateAddressDto, street: 'A'.repeat(221) };
      const error = new Error('O logradouro deve ter entre 3 e 220 caracteres.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para city vazia', async () => {
      const invalidDto = { ...validCreateAddressDto, city: '' };
      const error = new Error('A cidade não pode estar vazia.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para city muito curta', async () => {
      const invalidDto = { ...validCreateAddressDto, city: 'A' };
      const error = new Error('A cidade deve ter entre 2 e 100 caracteres.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para city muito longa', async () => {
      const invalidDto = { ...validCreateAddressDto, city: 'A'.repeat(101) };
      const error = new Error('A cidade deve ter entre 2 e 100 caracteres.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para neighborhood vazio', async () => {
      const invalidDto = { ...validCreateAddressDto, neighborhood: '' };
      const error = new Error('O bairro não pode estar vazio.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para neighborhood muito curto', async () => {
      const invalidDto = { ...validCreateAddressDto, neighborhood: 'AB' };
      const error = new Error('O bairro deve ter entre 3 e 220 caracteres.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para number vazio', async () => {
      const invalidDto = { ...validCreateAddressDto, number: '' };
      const error = new Error('O número não pode estar vazio.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para number não numérico', async () => {
      const invalidDto = { ...validCreateAddressDto, number: 'ABC' };
      const error = new Error('O número deve conter apenas caracteres numéricos.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para number muito longo', async () => {
      const invalidDto = { ...validCreateAddressDto, number: '1'.repeat(21) };
      const error = new Error('O número deve ter entre 1 e 20 caracteres.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para supplierId menor que 1', async () => {
      const invalidDto = { ...validCreateAddressDto, supplierId: 0 };
      const error = new Error('O ID do fornecedor deve ser um número maior ou igual a 1.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para supplierId maior que 9999', async () => {
      const invalidDto = { ...validCreateAddressDto, supplierId: 10000 };
      const error = new Error('O ID do fornecedor deve ser um número menor ou igual a 9999.');
      addressService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('deve retornar um AddressDto quando endereço existe', async () => {
      addressService.findOne.mockResolvedValue(mockAddress);

      const result = await controller.findOne('1');

      expect(addressService.findOne).toHaveBeenCalledWith(1);
      expect(addressService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(AddressDto);
      expect(result.id).toBe(mockAddress.id);
      expect(result.street).toBe(mockAddress.street);
    });

    it('deve lançar NotFoundException quando endereço não existe', async () => {
      addressService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(controller.findOne('999')).rejects.toThrow('Endereço não encontrado.');
      expect(addressService.findOne).toHaveBeenCalledWith(999);
      expect(addressService.findOne).toHaveBeenCalledTimes(2);
    });

    it('deve propagar erro do serviço', async () => {
      const error = new Error('Database error');
      addressService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('1')).rejects.toThrow(error);
      expect(addressService.findOne).toHaveBeenCalledWith(1);
      expect(addressService.findOne).toHaveBeenCalledTimes(1);
    });

    it('deve converter string id para number', async () => {
      addressService.findOne.mockResolvedValue(mockAddress);

      await controller.findOne('123');

      expect(addressService.findOne).toHaveBeenCalledWith(123);
    });
  });

  describe('update', () => {
    const validUpdateAddressDto: UpdateAddressDto = {
      street: 'Rua Atualizada',
      city: 'Rio de Janeiro',
      neighborhood: 'Copacabana',
      number: '456',
      supplierId: 2,
    };

    const updatedAddress: Address = {
      ...mockAddress,
      ...validUpdateAddressDto,
    };

    it('deve atualizar um endereço com dados válidos', async () => {
      addressService.update.mockResolvedValue(updatedAddress);

      const result = await controller.update('1', validUpdateAddressDto);

      expect(addressService.update).toHaveBeenCalledWith(1, validUpdateAddressDto);
      expect(addressService.update).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(AddressDto);
      expect(result.id).toBe(updatedAddress.id);
      expect(result.street).toBe(validUpdateAddressDto.street);
      expect(result.city).toBe(validUpdateAddressDto.city);
    });

    it('deve atualizar endereço com dados parciais', async () => {
      const partialUpdateDto: UpdateAddressDto = {
        street: 'Apenas Rua Atualizada',
      };
      const partiallyUpdatedAddress: Address = {
        ...mockAddress,
        street: partialUpdateDto.street!,
      };
      addressService.update.mockResolvedValue(partiallyUpdatedAddress);

      const result = await controller.update('1', partialUpdateDto);

      expect(addressService.update).toHaveBeenCalledWith(1, partialUpdateDto);
      expect(addressService.update).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(AddressDto);
      expect(result.street).toBe(partialUpdateDto.street);
      expect(result.city).toBe(mockAddress.city); // Mantém valor original
    });

    it('deve propagar erro quando endereço não existe', async () => {
      const error = new Error('Address not found');
      addressService.update.mockRejectedValue(error);

      await expect(controller.update('999', validUpdateAddressDto)).rejects.toThrow(error);
      expect(addressService.update).toHaveBeenCalledWith(999, validUpdateAddressDto);
      expect(addressService.update).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro quando fornecedor não existe', async () => {
      const error = new Error('Supplier not found');
      addressService.update.mockRejectedValue(error);

      await expect(controller.update('1', validUpdateAddressDto)).rejects.toThrow(error);
      expect(addressService.update).toHaveBeenCalledWith(1, validUpdateAddressDto);
      expect(addressService.update).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de validação para dados inválidos', async () => {
      const invalidDto = { ...validUpdateAddressDto, street: 'AB' };
      const error = new Error('O logradouro deve ter entre 3 e 220 caracteres.');
      addressService.update.mockRejectedValue(error);

      await expect(controller.update('1', invalidDto)).rejects.toThrow(error);
    });

    it('deve converter string id para number', async () => {
      addressService.update.mockResolvedValue(updatedAddress);

      await controller.update('123', validUpdateAddressDto);

      expect(addressService.update).toHaveBeenCalledWith(123, validUpdateAddressDto);
    });
  });

  describe('remove', () => {
    it('deve remover um endereço que existe', async () => {
      addressService.findOne.mockResolvedValue(mockAddress);
      addressService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(addressService.findOne).toHaveBeenCalledWith(1);
      expect(addressService.findOne).toHaveBeenCalledTimes(1);
      expect(addressService.remove).toHaveBeenCalledWith(mockAddress);
      expect(addressService.remove).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('deve lançar NotFoundException quando endereço não existe', async () => {
      addressService.findOne.mockResolvedValue(null);

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      await expect(controller.remove('999')).rejects.toThrow('Endereço não encontrado.');
      expect(addressService.findOne).toHaveBeenCalledWith(999);
      expect(addressService.findOne).toHaveBeenCalledTimes(2);
      expect(addressService.remove).not.toHaveBeenCalled();
    });

    it('deve propagar erro do serviço no findOne', async () => {
      const error = new Error('Database error');
      addressService.findOne.mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow(error);
      expect(addressService.findOne).toHaveBeenCalledWith(1);
      expect(addressService.findOne).toHaveBeenCalledTimes(1);
      expect(addressService.remove).not.toHaveBeenCalled();
    });

    it('deve propagar erro do serviço no remove', async () => {
      const error = new Error('Delete error');
      addressService.findOne.mockResolvedValue(mockAddress);
      addressService.remove.mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow(error);
      expect(addressService.findOne).toHaveBeenCalledWith(1);
      expect(addressService.remove).toHaveBeenCalledWith(mockAddress);
    });

    it('deve converter string id para number', async () => {
      addressService.findOne.mockResolvedValue(mockAddress);
      addressService.remove.mockResolvedValue(undefined);

      await controller.remove('123');

      expect(addressService.findOne).toHaveBeenCalledWith(123);
    });
  });
});
