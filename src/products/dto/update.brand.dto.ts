import { OmitType, PartialType } from '@nestjs/swagger';
import CreateBrandDto from './create.brand.dto';

export default class UpdateBrandDto extends PartialType(CreateBrandDto) {}