import { ParentsService } from './parents.service';
import { Parent } from './parent.entity';
export declare class ParentsController {
    private readonly parentsService;
    constructor(parentsService: ParentsService);
    findAll(): Promise<Parent[]>;
    create(parent: Partial<Parent>): Promise<Parent>;
}
