import { Repository } from 'typeorm';
import { Student } from './student.entity';
export declare class StudentsService {
    private studentsRepository;
    constructor(studentsRepository: Repository<Student>);
    findAll(): Promise<Student[]>;
    create(student: Partial<Student>): Promise<Student>;
}
