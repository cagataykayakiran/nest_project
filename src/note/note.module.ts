import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [NoteController],
  providers: [NoteService, PrismaService],
  imports: [PrismaModule],
})
export class NoteModule {}
