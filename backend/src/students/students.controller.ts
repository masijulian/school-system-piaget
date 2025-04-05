import { Controller, Get, Post, Body } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Student } from './student.entity';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll(): Promise<Student[]> {
    return this.studentsService.findAll().then((students) => {
      if (!Array.isArray(students)) {
        throw new Error('Invalid return type: Expected an array of students');
      }
      return students;
    });
  }

  @Post()
  create(@Body() student: Partial<Student>): Promise<Student> {
    return this.studentsService.create(student);
  }
}
