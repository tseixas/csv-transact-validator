import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  amount: number;

  @Column({ default: '' })
  message: string;

  @Column()
  fileName: string;
}
