import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskStatusEnum } from './taskDto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { Repository, FindOptionsWhere, Like } from 'typeorm';

@Injectable()
export class TaskService {
    private tasks: TaskDto[] = [];

    constructor(
        @InjectRepository(TaskEntity) private readonly taskRepository: Repository<TaskEntity>,
    ) { }

    async create(task: TaskDto): Promise<TaskDto> {
        const taskToSave: Partial<TaskEntity> = {
            title: task.title,
            description: task.description,
            expirationDate: task.expirationDate,
            status: TaskStatusEnum.TO_DO,
        };

        const createdTask = await this.taskRepository.save(taskToSave);
        return this.mapEntityToDto(createdTask);
    }

    async findTaskById(id: string): Promise<TaskDto> {
        const foundTask = await this.taskRepository.findOne({ where: { id } });

        if (!foundTask) {
            throw new NotFoundException(`Task with id ${id} not found.`);
        }

        return this.mapEntityToDto(foundTask);
    }

    async update(id: string, task: TaskDto): Promise<void> {
        const foundTask = await this.taskRepository.findOne({ where: { id } })

        if (!foundTask) {
            throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);

        }

        await this.taskRepository.update(id, this.mapDtoToEntity(task) )


    }

    async deleteTaskById(id: string): Promise<void> {
        const result = await this.taskRepository.delete(id)



        if (!result.affected) {
            throw new HttpException(`Task with id ${id} not found`, HttpStatus.NOT_FOUND);
        }

        
    }

    async findAll(params: FindAllParameters): Promise<TaskDto[]> {
        const searchParams: FindOptionsWhere<TaskEntity> = {}

        if (params.title) {
            searchParams.title = Like(`%${params.title}%`)
        }

        if (params.status) {
            searchParams.status = Like(`%${params.status}%`)
        }

        const tasksFound = await this.taskRepository.find({ where: searchParams })

        return tasksFound.map(task => this.mapEntityToDto(task))


    }

    private mapEntityToDto(taskEntity: TaskEntity): TaskDto {
        return {
            id: taskEntity.id,
            title: taskEntity.title,
            description: taskEntity.description,
            status: TaskStatusEnum[taskEntity.status],
            expirationDate: taskEntity.expirationDate
        }
    }

    private mapDtoToEntity(taskDto: TaskDto): Partial<TaskEntity> {
        return {
        
            title: taskDto.title,
            description: taskDto.description,
            status: TaskStatusEnum[taskDto.status],
            expirationDate: taskDto.expirationDate
        }

    }
 }
