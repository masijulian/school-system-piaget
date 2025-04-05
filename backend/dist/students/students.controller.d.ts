import { StudentsService } from './students.service';
import { Student } from './student.entity';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    findAll(): Promise<Student[]>;
    create(student: Partial<Student>): Promise<Student>;
}
