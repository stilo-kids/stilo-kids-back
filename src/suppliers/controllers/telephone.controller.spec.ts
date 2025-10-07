import { Test, TestingModule } from '@nestjs/testing';
import { TelephoneController } from './telephone.controller';
import { TelephoneService } from '../services/telephone.service';
import { CreateTelephoneDto } from '../dto/create.telephone.dto';
import { UpdateTelephoneDto } from '../dto/update.telephone.dto';
import { TelephoneDto } from '../dto/telephone.dto';
import { Telephone } from '../entities/telephone.entity';
import { Supplier } from '../entities/supplier.entity';
import { NotFoundException } from '@nestjs/common';

describe('TelephoneController', () => {
  let controller: TelephoneController;
  let telephoneService: jest.Mocked<TelephoneService>;

  const mockSupplier: Supplier = {
    id: 1,
    name: 'Fornecedor Teste',
    createdAt: new Date('2023-01-01'),
    deletedAt: null,
    addresses: [],
    telephones: [],
  };

  const mockTelephone: Telephone = {
    id: 1,
    number: '+55 11 91234-5678',
    supplier: mockSupplier,
    supplierId: 1,
    createdAt: new Date('2023-01-01'),
    deletedAt: null,
  };

  const mockTelephone2: Telephone = {
    id: 2,
    number: '+55 21 98765-4321',
    supplier: mockSupplier,
    supplierId: 1,
    createdAt: new Date('2023-01-02'),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelephoneController],
      providers: [
        {
          provide: TelephoneService,
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

    controller = module.get<TelephoneController>(TelephoneController);
    telephoneService = module.get(TelephoneService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar um array de TelephoneDto quando há telefones', async () => {
      const mockTelephones = [mockTelephone, mockTelephone2];
      telephoneService.findAll.mockResolvedValue(mockTelephones);

      const result = await controller.findAll();

      expect(telephoneService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(TelephoneDto);
      expect(result[0].id).toBe(mockTelephone.id);
      expect(result[0].number).toBe(mockTelephone.number);
      expect(result[0].supplierId).toBe(mockTelephone.supplierId);
      expect(result[1]).toBeInstanceOf(TelephoneDto);
      expect(result[1].id).toBe(mockTelephone2.id);
    });

    it('deve retornar um array vazio quando não há telefones', async () => {
      telephoneService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(telephoneService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('deve propagar erro do serviço', async () => {
      const error = new Error('Database error');
      telephoneService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
      expect(telephoneService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    const validCreateTelephoneDto: CreateTelephoneDto = {
      number: '+55 11 91234-5678',
      supplierId: 1,
    };

    it('deve criar um telefone com dados válidos', async () => {
      telephoneService.create.mockResolvedValue(mockTelephone);

      const result = await controller.create(validCreateTelephoneDto);

      expect(telephoneService.create).toHaveBeenCalledWith(validCreateTelephoneDto);
      expect(telephoneService.create).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(TelephoneDto);
      expect(result.id).toBe(mockTelephone.id);
      expect(result.number).toBe(mockTelephone.number);
      expect(result.supplierId).toBe(mockTelephone.supplierId);
      expect(result.createdAt).toBe(mockTelephone.createdAt);
    });

    it('deve propagar erro quando fornecedor não existe', async () => {
      const error = new Error('Supplier not found');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(validCreateTelephoneDto)).rejects.toThrow(error);
      expect(telephoneService.create).toHaveBeenCalledWith(validCreateTelephoneDto);
      expect(telephoneService.create).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de validação para number vazio', async () => {
      const invalidDto = { ...validCreateTelephoneDto, number: '' };
      const error = new Error('O número de telefone não pode estar vazio.');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para number muito curto', async () => {
      const invalidDto = { ...validCreateTelephoneDto, number: '1234567' };
      const error = new Error('O número de telefone deve ter entre 8 e 20 caracteres.');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para number muito longo', async () => {
      const invalidDto = { ...validCreateTelephoneDto, number: '+55 11 912345678901234' };
      const error = new Error('O número de telefone deve ter entre 8 e 20 caracteres.');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para formato inválido de telefone', async () => {
      const invalidDto = { ...validCreateTelephoneDto, number: '11912345678' };
      const error = new Error('O telefone deve estar no formato +55 XX 9XXXX-XXXX');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para formato inválido - sem +55', async () => {
      const invalidDto = { ...validCreateTelephoneDto, number: '11 91234-5678' };
      const error = new Error('O telefone deve estar no formato +55 XX 9XXXX-XXXX');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para formato inválido - sem traço', async () => {
      const invalidDto = { ...validCreateTelephoneDto, number: '+55 11 912345678' };
      const error = new Error('O telefone deve estar no formato +55 XX 9XXXX-XXXX');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para formato inválido - DDD incorreto', async () => {
      const invalidDto = { ...validCreateTelephoneDto, number: '+55 1 91234-5678' };
      const error = new Error('O telefone deve estar no formato +55 XX 9XXXX-XXXX');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para number não string', async () => {
      const invalidDto = { ...validCreateTelephoneDto, number: 11912345678 as any };
      const error = new Error('O número de telefone deve ser um texto.');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para supplierId menor que 1', async () => {
      const invalidDto = { ...validCreateTelephoneDto, supplierId: 0 };
      const error = new Error('O ID do fornecedor deve ser um número maior ou igual a 1.');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para supplierId maior que 9999', async () => {
      const invalidDto = { ...validCreateTelephoneDto, supplierId: 10000 };
      const error = new Error('O ID do fornecedor deve ser um número menor ou igual a 9999.');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para supplierId vazio', async () => {
      const invalidDto = { ...validCreateTelephoneDto, supplierId: undefined as any };
      const error = new Error('O ID do fornecedor não pode estar vazio.');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para supplierId não numérico', async () => {
      const invalidDto = { ...validCreateTelephoneDto, supplierId: 'abc' as any };
      const error = new Error('O ID do fornecedor deve conter apenas caracteres numéricos.');
      telephoneService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('deve retornar um TelephoneDto quando telefone existe', async () => {
      telephoneService.findOne.mockResolvedValue(mockTelephone);

      const result = await controller.findOne('1');

      expect(telephoneService.findOne).toHaveBeenCalledWith(1);
      expect(telephoneService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(TelephoneDto);
      expect(result.id).toBe(mockTelephone.id);
      expect(result.number).toBe(mockTelephone.number);
    });

    it('deve lançar NotFoundException quando telefone não existe', async () => {
      telephoneService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(controller.findOne('999')).rejects.toThrow('Telefone não encontrado.');
      expect(telephoneService.findOne).toHaveBeenCalledWith(999);
      expect(telephoneService.findOne).toHaveBeenCalledTimes(2);
    });

    it('deve propagar erro do serviço', async () => {
      const error = new Error('Database error');
      telephoneService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('1')).rejects.toThrow(error);
      expect(telephoneService.findOne).toHaveBeenCalledWith(1);
      expect(telephoneService.findOne).toHaveBeenCalledTimes(1);
    });

    it('deve converter string id para number', async () => {
      telephoneService.findOne.mockResolvedValue(mockTelephone);

      await controller.findOne('123');

      expect(telephoneService.findOne).toHaveBeenCalledWith(123);
    });
  });

  describe('update', () => {
    const validUpdateTelephoneDto: UpdateTelephoneDto = {
      number: '+55 21 99999-8888',
      supplierId: 2,
    };

    const updatedTelephone: Telephone = {
      ...mockTelephone,
      ...validUpdateTelephoneDto,
    };

    it('deve atualizar um telefone com dados válidos', async () => {
      telephoneService.update.mockResolvedValue(updatedTelephone);

      const result = await controller.update('1', validUpdateTelephoneDto);

      expect(telephoneService.update).toHaveBeenCalledWith(1, validUpdateTelephoneDto);
      expect(telephoneService.update).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(TelephoneDto);
      expect(result.id).toBe(updatedTelephone.id);
      expect(result.number).toBe(validUpdateTelephoneDto.number);
      expect(result.supplierId).toBe(validUpdateTelephoneDto.supplierId);
    });

    it('deve atualizar telefone com dados parciais', async () => {
      const partialUpdateDto: UpdateTelephoneDto = {
        number: '+55 11 99999-7777',
      };
      const partiallyUpdatedTelephone: Telephone = {
        ...mockTelephone,
        number: partialUpdateDto.number!,
      };
      telephoneService.update.mockResolvedValue(partiallyUpdatedTelephone);

      const result = await controller.update('1', partialUpdateDto);

      expect(telephoneService.update).toHaveBeenCalledWith(1, partialUpdateDto);
      expect(telephoneService.update).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(TelephoneDto);
      expect(result.number).toBe(partialUpdateDto.number);
      expect(result.supplierId).toBe(mockTelephone.supplierId); // Mantém valor original
    });

    it('deve propagar erro quando telefone não existe no service', async () => {
      const error = new Error('Telephone not found');
      telephoneService.update.mockRejectedValue(error);

      await expect(controller.update('999', validUpdateTelephoneDto)).rejects.toThrow(error);
      expect(telephoneService.update).toHaveBeenCalledWith(999, validUpdateTelephoneDto);
      expect(telephoneService.update).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro quando fornecedor não existe', async () => {
      const error = new Error('Supplier not found');
      telephoneService.update.mockRejectedValue(error);

      await expect(controller.update('1', validUpdateTelephoneDto)).rejects.toThrow(error);
      expect(telephoneService.update).toHaveBeenCalledWith(1, validUpdateTelephoneDto);
      expect(telephoneService.update).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de validação para dados inválidos', async () => {
      const invalidDto = { ...validUpdateTelephoneDto, number: 'invalid' };
      const error = new Error('O telefone deve estar no formato +55 XX 9XXXX-XXXX');
      telephoneService.update.mockRejectedValue(error);

      await expect(controller.update('1', invalidDto)).rejects.toThrow(error);
    });

    it('deve converter string id para number', async () => {
      telephoneService.update.mockResolvedValue(updatedTelephone);

      await controller.update('123', validUpdateTelephoneDto);

      expect(telephoneService.update).toHaveBeenCalledWith(123, validUpdateTelephoneDto);
    });
  });

  describe('remove', () => {
    it('deve remover um telefone que existe', async () => {
      telephoneService.findOne.mockResolvedValue(mockTelephone);
      telephoneService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(telephoneService.findOne).toHaveBeenCalledWith(1);
      expect(telephoneService.findOne).toHaveBeenCalledTimes(1);
      expect(telephoneService.remove).toHaveBeenCalledWith(mockTelephone);
      expect(telephoneService.remove).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('deve lançar NotFoundException quando telefone não existe', async () => {
      telephoneService.findOne.mockResolvedValue(null);

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      await expect(controller.remove('999')).rejects.toThrow('Telefone não encontrado.');
      expect(telephoneService.findOne).toHaveBeenCalledWith(999);
      expect(telephoneService.findOne).toHaveBeenCalledTimes(2);
      expect(telephoneService.remove).not.toHaveBeenCalled();
    });

    it('deve propagar erro do serviço no findOne', async () => {
      const error = new Error('Database error');
      telephoneService.findOne.mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow(error);
      expect(telephoneService.findOne).toHaveBeenCalledWith(1);
      expect(telephoneService.findOne).toHaveBeenCalledTimes(1);
      expect(telephoneService.remove).not.toHaveBeenCalled();
    });

    it('deve propagar erro do serviço no remove', async () => {
      const error = new Error('Delete error');
      telephoneService.findOne.mockResolvedValue(mockTelephone);
      telephoneService.remove.mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow(error);
      expect(telephoneService.findOne).toHaveBeenCalledWith(1);
      expect(telephoneService.remove).toHaveBeenCalledWith(mockTelephone);
    });

    it('deve converter string id para number', async () => {
      telephoneService.findOne.mockResolvedValue(mockTelephone);
      telephoneService.remove.mockResolvedValue(undefined);

      await controller.remove('123');

      expect(telephoneService.findOne).toHaveBeenCalledWith(123);
    });
  });
});
