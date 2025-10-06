import { PartialType } from "@nestjs/swagger";
import { CreateSupplierTelephoneDto } from "./create.supplier.telephone.dto";

export class UpdateSupplierTelephoneDto extends PartialType(CreateSupplierTelephoneDto) {}