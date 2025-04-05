import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './parent.entity';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,
  ) {}

  findAll(): Promise<Parent[]> {
    return this.parentsRepository.find({ relations: ['students'] });
  }

  create(parent: Partial<Parent>): Promise<Parent> {
    const newParent = this.parentsRepository.create(parent);
    return this.parentsRepository.save(newParent);
  }
}
