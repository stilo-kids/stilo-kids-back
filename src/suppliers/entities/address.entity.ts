import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  street: string;

  @Column('varchar', { length: 100 })
  city: string;

  @Column('varchar', { length: 255 })
  neighborhood: string;

  @Column('varchar', { length: 20 })
  number: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.addresses)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column('int', { name: 'supplier_id' })
  supplierId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
