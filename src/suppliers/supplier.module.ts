import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierController } from './controllers/supplier.controller';
import { SupplierService } from './services/supplier.service';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { Address } from './entities/address.entity';
import { Telephone } from './entities/telephone.entity';
import { TelephoneService } from './services/telephone.service';
import { TelephoneController } from './controllers/telephone.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Address, Telephone])],
  controllers: [SupplierController, AddressController, TelephoneController],
  providers: [SupplierService, AddressService, TelephoneService],
})
export class SupplierModule {}
