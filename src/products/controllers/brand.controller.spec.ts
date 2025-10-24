import { Test, TestingModule } from '@nestjs/testing';
import { BrandController } from './brand.controller';
import { BrandService } from '../services/brand.service';
import CreateBrandDto from '../dto/create.brand.dto';
import UpdateBrandDto from '../dto/update.brand.dto';
import BrandDto from '../dto/brand.dto';
import { Brand } from '../entities/brand.entity';
import { NotFoundException } from '@nestjs/common';

describe('BrandController', () => {
  let controller: BrandController;
  let brandService: jest.Mocked<BrandService>;

  const mockBrand: Brand = {
    id: 1,
    name: 'Marca Teste',
    createdAt: new Date('2023-01-01'),
    deletedAt: null,
  };

  const mockBrand2: Brand = {
    id: 2,
    name: 'Segunda Marca',
    createdAt: new Date('2023-01-02'),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [
        {
          provide: BrandService,
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

    controller = module.get<BrandController>(BrandController);
    brandService = module.get(BrandService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar um array de BrandDto quando houver marcas', async () => {
      const mockBrands = [mockBrand, mockBrand2];
      brandService.findAll.mockResolvedValue(mockBrands);

      const result = await controller.findAll();

      expect(brandService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(BrandDto);
      expect(result[0].id).toBe(mockBrand.id);
      expect(result[0].name).toBe(mockBrand.name);
      expect(result[1]).toBeInstanceOf(BrandDto);
      expect(result[1].id).toBe(mockBrand2.id);
    });

    it('deve retornar um array vazio quando não houver marcas', async () => {
      brandService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(brandService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('deve propagar erro do serviço', async () => {
      const error = new Error('Database error');
      brandService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
      expect(brandService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    const validCreateBrandDto: CreateBrandDto = {
      name: 'Nova Marca',
    };

    it('deve criar uma marca com dados válidos', async () => {
      const createdBrand = { ...mockBrand, name: validCreateBrandDto.name };
      brandService.create.mockResolvedValue(createdBrand);

      const result = await controller.create(validCreateBrandDto);

      expect(brandService.create).toHaveBeenCalledWith(validCreateBrandDto);
      expect(brandService.create).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(BrandDto);
      expect(result.id).toBe(createdBrand.id);
      expect(result.name).toBe(createdBrand.name);
    });

    it('deve propagar erro do serviço', async () => {
      const error = new Error('Database error');
      brandService.create.mockRejectedValue(error);

      await expect(controller.create(validCreateBrandDto)).rejects.toThrow(error);
      expect(brandService.create).toHaveBeenCalledWith(validCreateBrandDto);
      expect(brandService.create).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de validação para nome vazio', async () => {
      const invalidDto = { ...validCreateBrandDto, name: '' };
      const error = new Error('O nome da marca não pode estar vazio.');
      brandService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para nome muito curto', async () => {
      const invalidDto = { ...validCreateBrandDto, name: 'AB' };
      const error = new Error('O nome da marca deve ter entre 3 e 200 caracteres.');
      brandService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });

    it('deve propagar erro de validação para nome não string', async () => {
      const invalidDto = { ...validCreateBrandDto, name: 123 as any };
      const error = new Error('O nome da marca deve ser um texto.');
      brandService.create.mockRejectedValue(error);

      await expect(controller.create(invalidDto)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('deve retornar um BrandDto quando marca existir', async () => {
      brandService.findOne.mockResolvedValue(mockBrand);

      const result = await controller.findOne('1');

      expect(brandService.findOne).toHaveBeenCalledWith(1);
      expect(brandService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(BrandDto);
      expect(result.id).toBe(mockBrand.id);
      expect(result.name).toBe(mockBrand.name);
    });

    it('deve lançar NotFoundException quando marca não existe', async () => {
      brandService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(controller.findOne('999')).rejects.toThrow('Marca não encontrado.');
      expect(brandService.findOne).toHaveBeenCalledWith(999);
      expect(brandService.findOne).toHaveBeenCalledTimes(2);
    });

    it('deve propagar erro do serviço', async () => {
      const error = new Error('Database error');
      brandService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('1')).rejects.toThrow(error);
      expect(brandService.findOne).toHaveBeenCalledWith(1);
      expect(brandService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    const validUpdateBrandDto: UpdateBrandDto = {
      name: 'Marca Atualizada',
    };

    const updatedBrand: Brand = {
      ...mockBrand,
      name: validUpdateBrandDto.name!,
    };

    it('deve atualizar uma marca com dados válidos', async () => {
      brandService.findOne.mockResolvedValue(mockBrand);
      brandService.update.mockResolvedValue(updatedBrand);

      const result = await controller.update('1', validUpdateBrandDto);

      expect(brandService.findOne).toHaveBeenCalledWith(1);
      expect(brandService.findOne).toHaveBeenCalledTimes(1);
      expect(brandService.update).toHaveBeenCalledWith(1, validUpdateBrandDto);
      expect(brandService.update).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(BrandDto);
      expect(result.id).toBe(updatedBrand.id);
      expect(result.name).toBe(validUpdateBrandDto.name);
    });

    it('deve lançar NotFoundException quando marca não existe', async () => {
      brandService.findOne.mockResolvedValue(null);

      await expect(controller.update('999', validUpdateBrandDto)).rejects.toThrow(NotFoundException);
      await expect(controller.update('999', validUpdateBrandDto)).rejects.toThrow('Marca não encontrada.');
      expect(brandService.findOne).toHaveBeenCalledWith(999);
      expect(brandService.findOne).toHaveBeenCalledTimes(2);
      expect(brandService.update).not.toHaveBeenCalled();
    });

    it('deve propagar erro do serviço no update', async () => {
      const error = new Error('Update error');
      brandService.findOne.mockResolvedValue(mockBrand);
      brandService.update.mockRejectedValue(error);

      await expect(controller.update('1', validUpdateBrandDto)).rejects.toThrow(error);
      expect(brandService.findOne).toHaveBeenCalledWith(1);
      expect(brandService.update).toHaveBeenCalledWith(1, validUpdateBrandDto);
    });

    it('deve propagar erro de validação para dados inválidos', async () => {
      const invalidDto = { ...validUpdateBrandDto, name: 'AB' };
      const error = new Error('O nome da marca deve ter entre 3 e 200 caracteres.');
      brandService.findOne.mockResolvedValue(mockBrand);
      brandService.update.mockRejectedValue(error);

      await expect(controller.update('1', invalidDto)).rejects.toThrow(error);
    });

  });

  describe('remove', () => {
    it('deve remover uma marca que existe', async () => {
      brandService.findOne.mockResolvedValue(mockBrand);
      brandService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(brandService.findOne).toHaveBeenCalledWith(1);
      expect(brandService.findOne).toHaveBeenCalledTimes(1);
      expect(brandService.remove).toHaveBeenCalledWith(mockBrand);
      expect(brandService.remove).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('deve lançar NotFoundException quando a marca não existe', async () => {
      brandService.findOne.mockResolvedValue(null);

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      await expect(controller.remove('999')).rejects.toThrow('Marca não encontrada.');
      expect(brandService.findOne).toHaveBeenCalledWith(999);
      expect(brandService.findOne).toHaveBeenCalledTimes(2);
      expect(brandService.remove).not.toHaveBeenCalled();
    });

    it('deve propagar erro do serviço no findOne', async () => {
      const error = new Error('Database error');
      brandService.findOne.mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow(error);
      expect(brandService.findOne).toHaveBeenCalledWith(1);
      expect(brandService.findOne).toHaveBeenCalledTimes(1);
      expect(brandService.remove).not.toHaveBeenCalled();
    });

    it('deve propagar erro do serviço no remove', async () => {
      const error = new Error('Delete error');
      brandService.findOne.mockResolvedValue(mockBrand);
      brandService.remove.mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow(error);
      expect(brandService.findOne).toHaveBeenCalledWith(1);
      expect(brandService.remove).toHaveBeenCalledWith(mockBrand);
    });
  });
});