import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoteService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createNoteDto: CreateNoteDto) {
    const { title, description, userId } = createNoteDto;
    const existingUser = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const note = await this.prismaService.note.create({
      data: {
        title: title,
        description: description,
        user: {
          connect: { id: userId },
        },
      },
    });
    return note;
  }

  async findAll() {
    return this.prismaService.note.findMany({
      include: { user: true },
    });
  }

  async findOne(id: string) {
    const existingNote = await this.prismaService.note.findUnique({
      where: { id: id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return this.prismaService.note.findUniqueOrThrow({
      where: { id: id },
      include: { user: true },
    });
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const existingNote = await this.prismaService.note.findUnique({
      where: { id: id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return this.prismaService.note.update({
      where: { id },
      data: {
        title: updateNoteDto.title,
        description: updateNoteDto.description,
        user: {
          connect: { id: updateNoteDto.userId },
        },
      },
    });
  }

  async remove(id: string) {
    const existingNote = await this.prismaService.note.findUnique({
      where: { id: id },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return this.prismaService.note.delete({
      where: { id: id },
    });
  }
}
