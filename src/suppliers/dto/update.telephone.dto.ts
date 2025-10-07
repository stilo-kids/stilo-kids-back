import { PartialType } from '@nestjs/swagger';
import { CreateTelephoneDto } from './create.telephone.dto';

export class UpdateTelephoneDto extends PartialType(CreateTelephoneDto) {
}
