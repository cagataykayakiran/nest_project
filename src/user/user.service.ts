import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('The email is already in use.');
    }

    const user = await this.prismaService.user.create({
      data: createUserDto,
    });
    return user;
  }

  async findAll() {
    const user = await this.prismaService.user.findMany({
      include: { notes: true },
    });
    return user;
  }

  async findOne(id: string) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { id },
        include: { notes: true },
      });
      return user;
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const user = await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
    return user;
  }

  async remove(id: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const user = await this.prismaService.user.delete({
      where: { id },
    });
    return user;
  }
}
