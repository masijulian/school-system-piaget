import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @OneToMany(() => Student, (student) => student.parent)
  students: Student[];
}
