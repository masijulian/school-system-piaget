import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { Parent } from './parent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parent])], // Añade esto
  controllers: [ParentsController],
  providers: [ParentsService],
})
export class ParentsModule {}
