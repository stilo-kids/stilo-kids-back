import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { Telephone } from './telephone.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, name: 'name' })
  name: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Address, (address) => address.supplier, { cascade: true, eager: true })
  addresses: Address[];

  @OneToMany(() => Telephone, (telephone) => telephone.supplier, { cascade: true, eager: true })
  telephones: Telephone[];
}
