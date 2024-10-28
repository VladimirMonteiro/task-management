import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FindAllParameters, TaskDto } from './taskDto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {

    constructor(private readonly taskService: TaskService) {}
    
    @Post()
    create(@Body() task: TaskDto) {
        this.taskService.create(task);

    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): TaskDto {
        return this.taskService.findTaskById(id);
    }

    @Get()
    findAll(@Query() params: FindAllParameters ): TaskDto[] {
       return this.taskService.findAll(params)

    }

    @Put()
    updated(@Body() task: TaskDto) {
        this.taskService.update(task)
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string) {
        this.taskService.deleteTaskById(id)
    }
}
