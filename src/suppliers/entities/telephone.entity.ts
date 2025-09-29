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

@Entity('telephones')
export class Telephone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 20, unique: true })
  number: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.telephones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column('int', { name: 'supplier_id' })
  supplierId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
