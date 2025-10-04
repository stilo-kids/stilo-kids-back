import { OmitType } from "@nestjs/swagger";
import { CreateTelephoneDto } from "./create.telephone.dto";

export class CreateSupplierTelephoneDto extends OmitType(CreateTelephoneDto, ['supplierId']) {}