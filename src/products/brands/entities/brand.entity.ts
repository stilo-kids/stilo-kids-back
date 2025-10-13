import { 
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
 } from "typeorm";

@Entity('brands')
export class brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, name: 'name' })
  name: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
