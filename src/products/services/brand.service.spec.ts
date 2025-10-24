import { Repository } from 'typeorm';
import { BrandService } from './brand.service';
import { Brand } from '../entities/brand.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import CreateBrandDto from '../dto/create.brand.dto';
import UpdateBrandDto from '../dto/update.brand.dto';

describe('BrandService', () => {
  let service: BrandService;
  let brandRepository: jest.Mocked<Repository<Brand>>;

  const mockBrand: Brand = {
    id: 1,
    name: 'Marca Teste',
    createdAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        {
          provide: getRepositoryToken(Brand),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            softRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
    brandRepository = module.get(getRepositoryToken(Brand));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar um array de marcas', async () => {
      const expectedBrands = [mockBrand];
      brandRepository.find.mockResolvedValue(expectedBrands);

      const result = await service.findAll();

      expect(brandRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(expectedBrands);
    });

    it('deve retornar um array vazio quando não há marcas', async () => {
      brandRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(brandRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma marca', async () => {
      const brandId = 1;
      brandRepository.findOneOrFail.mockResolvedValue(mockBrand);

      const result = await service.findOne(brandId);

      expect(brandRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: brandId },
      });
      expect(result).toEqual(mockBrand);
    });

    it('deve lançar erro quando marca não é encontrado', async () => {
      const brandId = 999;
      const error = new Error('EntityNotFound');
      brandRepository.findOneOrFail.mockRejectedValue(error);

      await expect(service.findOne(brandId)).rejects.toThrow(error);

      expect(brandRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: brandId },
      });
    });
  });

  describe('create', () => {
    const createBrandDto: CreateBrandDto = {
      name: 'Nova Marca',
    };

    it('deve criar uma marca com sucesso', async () => {
      const createdBrand = { ...mockBrand, name: createBrandDto.name };
      brandRepository.create.mockReturnValue(createdBrand);
      brandRepository.save.mockResolvedValue(createdBrand);

      const result = await service.create(createBrandDto);

      expect(brandRepository.create).toHaveBeenCalledWith(createBrandDto);
      expect(brandRepository.save).toHaveBeenCalledWith(createdBrand);
      expect(result).toEqual(createdBrand);
    });
  });

  describe('update', () => {
    const brandId = 1;

    it('deve atualizar marca', async () => {
      const updateBrandDto: UpdateBrandDto = {
        name: 'Marca Completamente Atualizado',
      };
      const existingBrand = { ...mockBrand };
      const updatedBrand = {
        ...existingBrand,
        name: updateBrandDto.name!,
      };

      brandRepository.findOne.mockResolvedValue(existingBrand);
      brandRepository.save.mockResolvedValue(updatedBrand);

      const result = await service.update(brandId, updateBrandDto);

      expect(result).toEqual(updatedBrand);
    });

    it('deve lançar erro quando marca não é encontrada', async () => {
      const updateBrandDto: UpdateBrandDto = {
        name: 'Marca Inexistente',
      };

      brandRepository.findOne.mockResolvedValue(null);

      await expect(service.update(brandId, updateBrandDto)).rejects.toThrow('Brand not found');

      expect(brandRepository.findOne).toHaveBeenCalledWith({
        where: { id: brandId },
      });
      expect(brandRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover uma marca com sucesso (soft delete)', async () => {
      const brandToRemove = { ...mockBrand };
      brandRepository.softRemove.mockResolvedValue(brandToRemove);

      await service.remove(brandToRemove);

      expect(brandRepository.softRemove).toHaveBeenCalledWith(brandToRemove);
    });

    it('deve lidar com erro durante remoção', async () => {
      const brandToRemove = { ...mockBrand };
      const error = new Error('Erro ao remover marca');
      brandRepository.softRemove.mockRejectedValue(error);

      await expect(service.remove(brandToRemove)).rejects.toThrow(error);

      expect(brandRepository.softRemove).toHaveBeenCalledWith(brandToRemove);
    });
  });
});