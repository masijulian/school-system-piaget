import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Parent } from '../parents/parent.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  grade: string;

  @Column({ default: 0 })
  attendance: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Parent, (parent) => parent.students)
  parent: Parent;
}
