import { Repository } from 'typeorm';
import { Parent } from './parent.entity';
export declare class ParentsService {
    private parentsRepository;
    constructor(parentsRepository: Repository<Parent>);
    findAll(): Promise<Parent[]>;
    create(parent: Partial<Parent>): Promise<Parent>;
}
