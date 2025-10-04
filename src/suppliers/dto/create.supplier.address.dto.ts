import { OmitType } from "@nestjs/swagger";
import { CreateAddressDto } from "./create.address.dto";

export class CreateSupplierAddressDto extends OmitType(CreateAddressDto, ['supplierId']) {}