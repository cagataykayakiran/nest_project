import { Test, TestingModule } from '@nestjs/testing';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NoteController', () => {
  let controller: NoteController;
  let noteService: NoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [
        NoteService,
        {
          provide: PrismaService,
          useValue: {
            note: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockResolvedValue({}),
              update: jest.fn().mockResolvedValue({}),
              delete: jest.fn().mockResolvedValue({}),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<NoteController>(NoteController);
    noteService = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a note', async () => {
    const createNoteDto = {
      title: 'Test Note',
      description: 'Test Description',
      userId: '123',
    };
    const result = { id: '1', ...createNoteDto };

    jest.spyOn(noteService, 'create').mockResolvedValue(result);

    expect(await controller.create(createNoteDto)).toEqual(result);
    expect(noteService.create).toHaveBeenCalledWith(createNoteDto);
  });

  it('should return an array of notes', async () => {
    const result = [
      {
        id: '1',
        title: 'Test Note',
        description: 'Test Description',
        userId: '123',
        user: {
          id: '123',
          email: 'test@example.com',
          password: 'hashedpassword',
          name: 'Test User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ];

    jest.spyOn(noteService, 'findAll').mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
    expect(noteService.findAll).toHaveBeenCalled();
  });

  it('should return a note by id', async () => {
    const testId = '1';
    const result = {
      id: '1',
      title: 'Test Note',
      description: 'Test Description',
      userId: '123',
      user: {
        id: '123',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    jest.spyOn(noteService, 'findOne').mockResolvedValue(result);

    expect(await controller.findOne(testId)).toEqual(result);
    expect(noteService.findOne).toHaveBeenCalledWith(testId);
  });

  it('should update a note by id', async () => {
    const testId = '1';
    const updateNoteDto = {
      title: 'Test Note',
      description: 'Test Description',
      userId: '123',
    };

    const result = { id: testId, ...updateNoteDto };

    jest.spyOn(noteService, 'update').mockResolvedValue(result);

    expect(await controller.update(testId, updateNoteDto)).toEqual(result);
    expect(noteService.update).toHaveBeenCalledWith(testId, updateNoteDto);
  });

  it('should return a delete note by id', async () => {
    const testId = '1';
    const result = {
      id: '1',
      title: 'Test Note',
      description: 'Test Description',
      userId: '123',
      user: {
        id: '123',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    jest.spyOn(noteService, 'remove').mockResolvedValue(result);

    expect(await controller.remove(testId)).toEqual(result);
    expect(noteService.remove).toHaveBeenCalledWith(testId);
  });
});
