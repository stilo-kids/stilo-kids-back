import { Repository } from 'typeorm';
import { TelephoneService } from './telephone.service';
import { Supplier } from '../entities/supplier.entity';
import { Telephone } from '../entities/telephone.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTelephoneDto } from '../dto/create.telephone.dto';
import { UpdateTelephoneDto } from '../dto/update.telephone.dto';

describe('TelephoneService', () => {
  let service: TelephoneService;
  let telephoneRepository: jest.Mocked<Repository<Telephone>>;
  let supplierRepository: jest.Mocked<Repository<Supplier>>;

  const mockSupplier: Supplier = {
    id: 1,
    name: 'Fornecedor Teste',
    createdAt: new Date(),
    deletedAt: null,
    addresses: [],
    telephones: [],
  };

  const mockTelephone: Telephone = {
    id: 1,
    number: '+55 11 91234-5678',
    supplier: mockSupplier,
    supplierId: 1,
    createdAt: new Date(),
    deletedAt: null,
  };

  const mockTelephoneWithoutSupplier: Telephone = {
    id: 2,
    number: '+55 21 98765-4321',
    supplier: {} as Supplier,
    supplierId: 2,
    createdAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelephoneService,
        {
          provide: getRepositoryToken(Telephone),
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

    service = module.get<TelephoneService>(TelephoneService);
    telephoneRepository = module.get(getRepositoryToken(Telephone));
    supplierRepository = module.get(getRepositoryToken(Supplier));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar um array de telefones com relacionamento supplier', async () => {
      const expectedTelephones = [mockTelephone];
      telephoneRepository.find.mockResolvedValue(expectedTelephones);

      const result = await service.findAll();

      expect(telephoneRepository.find).toHaveBeenCalledWith({
        relations: {
          supplier: true,
        },
      });
      expect(result).toEqual(expectedTelephones);
    });

    it('deve retornar um array vazio quando não há telefones', async () => {
      telephoneRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(telephoneRepository.find).toHaveBeenCalledWith({
        relations: {
          supplier: true,
        },
      });
      expect(result).toEqual([]);
    });

    it('deve retornar telefones com supplier vazio', async () => {
      const expectedTelephones = [mockTelephoneWithoutSupplier];
      telephoneRepository.find.mockResolvedValue(expectedTelephones);

      const result = await service.findAll();

      expect(telephoneRepository.find).toHaveBeenCalledWith({
        relations: {
          supplier: true,
        },
      });
      expect(result).toEqual(expectedTelephones);
      expect(result[0].supplier).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('deve retornar um telefone com relacionamento supplier', async () => {
      const telephoneId = 1;
      telephoneRepository.findOneOrFail.mockResolvedValue(mockTelephone);

      const result = await service.findOne(telephoneId);

      expect(telephoneRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: telephoneId },
        relations: {
          supplier: true,
        },
      });
      expect(result).toEqual(mockTelephone);
    });

    it('deve retornar um telefone com supplier vazio', async () => {
      const telephoneId = 2;
      telephoneRepository.findOneOrFail.mockResolvedValue(mockTelephoneWithoutSupplier);

      const result = await service.findOne(telephoneId);

      expect(telephoneRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: telephoneId },
        relations: {
          supplier: true,
        },
      });
      expect(result).toEqual(mockTelephoneWithoutSupplier);
      expect(result?.supplier).toBeDefined();
    });

    it('deve lançar erro quando telefone não é encontrado', async () => {
      const telephoneId = 999;
      const error = new Error('EntityNotFound');
      telephoneRepository.findOneOrFail.mockRejectedValue(error);

      await expect(service.findOne(telephoneId)).rejects.toThrow(error);

      expect(telephoneRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: telephoneId },
        relations: {
          supplier: true,
        },
      });
    });
  });

  describe('create', () => {
    const createTelephoneDto: CreateTelephoneDto = {
      number: '+55 11 91234-5678',
      supplierId: 1,
    };

    it('deve criar um telefone com sucesso', async () => {
      const createdTelephone = { ...mockTelephone };
      supplierRepository.findOne.mockResolvedValue(mockSupplier);
      telephoneRepository.create.mockReturnValue(createdTelephone);
      telephoneRepository.save.mockResolvedValue(createdTelephone);

      const result = await service.create(createTelephoneDto);

      expect(supplierRepository.findOne).toHaveBeenCalledWith(createTelephoneDto.supplierId);
      expect(telephoneRepository.create).toHaveBeenCalledWith(createTelephoneDto);
      expect(telephoneRepository.save).toHaveBeenCalledWith({
        ...createdTelephone,
        supplier: mockSupplier,
      });
      expect(result).toEqual(createdTelephone);
    });

    it('deve lançar erro quando fornecedor não é encontrado', async () => {
      supplierRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createTelephoneDto)).rejects.toThrow('Supplier not found');

      expect(supplierRepository.findOne).toHaveBeenCalledWith(createTelephoneDto.supplierId);
      expect(telephoneRepository.create).not.toHaveBeenCalled();
      expect(telephoneRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const telephoneId = 1;
    const updateTelephoneDto: UpdateTelephoneDto = {
      number: '+55 11 99999-8888',
      supplierId: 1,
    };

    it('deve atualizar um telefone com sucesso', async () => {
      const existingTelephone = { ...mockTelephone };
      const updatedTelephone = { ...existingTelephone, ...updateTelephoneDto, supplier: mockSupplier };
      
      supplierRepository.findOne.mockResolvedValue(mockSupplier);
      jest.spyOn(service, 'findOne').mockResolvedValue(existingTelephone);
      telephoneRepository.save.mockResolvedValue(updatedTelephone);

      const result = await service.update(telephoneId, updateTelephoneDto);

      expect(supplierRepository.findOne).toHaveBeenCalledWith(updateTelephoneDto.supplierId);
      expect(service.findOne).toHaveBeenCalledWith(telephoneId);
      expect(telephoneRepository.save).toHaveBeenCalledWith({
        ...existingTelephone,
        ...updateTelephoneDto,
        supplier: mockSupplier,
      });
      expect(result).toEqual(updatedTelephone);
    });

    it('deve atualizar telefone quando supplierId não é fornecido', async () => {
      const updateDtoWithoutSupplierId: UpdateTelephoneDto = {
        number: '+55 11 88888-7777',
      };
      
      supplierRepository.findOne.mockResolvedValue(null);

      await expect(service.update(telephoneId, updateDtoWithoutSupplierId)).rejects.toThrow('Supplier not found');

      expect(supplierRepository.findOne).toHaveBeenCalledWith(0);
    });

    it('deve lançar erro quando fornecedor não é encontrado', async () => {
      supplierRepository.findOne.mockResolvedValue(null);

      await expect(service.update(telephoneId, updateTelephoneDto)).rejects.toThrow('Supplier not found');

      expect(supplierRepository.findOne).toHaveBeenCalledWith(updateTelephoneDto.supplierId);
      expect(telephoneRepository.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando telefone não é encontrado', async () => {
      const error = new Error('Telephone not found');
      supplierRepository.findOne.mockResolvedValue(mockSupplier);
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      await expect(service.update(telephoneId, updateTelephoneDto)).rejects.toThrow(error);

      expect(supplierRepository.findOne).toHaveBeenCalledWith(updateTelephoneDto.supplierId);
      expect(service.findOne).toHaveBeenCalledWith(telephoneId);
      expect(telephoneRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover um telefone com sucesso (soft delete)', async () => {
      const telephoneToRemove = { ...mockTelephone };
      telephoneRepository.softRemove.mockResolvedValue(telephoneToRemove);

      await service.remove(telephoneToRemove);

      expect(telephoneRepository.softRemove).toHaveBeenCalledWith(telephoneToRemove);
    });

    it('deve lidar com erro durante remoção', async () => {
      const telephoneToRemove = { ...mockTelephone };
      const error = new Error('Erro ao remover telefone');
      telephoneRepository.softRemove.mockRejectedValue(error);

      await expect(service.remove(telephoneToRemove)).rejects.toThrow(error);

      expect(telephoneRepository.softRemove).toHaveBeenCalledWith(telephoneToRemove);
    });
  });
});
