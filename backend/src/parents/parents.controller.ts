import { Controller, Get, Post, Body } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { Parent } from './parent.entity';

@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get()
  findAll(): Promise<Parent[]> {
    return this.parentsService.findAll();
  }

  @Post()
  create(@Body() parent: Partial<Parent>): Promise<Parent> {
    return this.parentsService.create(parent);
  }
}
