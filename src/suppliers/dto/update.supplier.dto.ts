import { OmitType, PartialType } from '@nestjs/swagger';
import CreateSupplierDto from './create.supplier.dto';

export default class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}