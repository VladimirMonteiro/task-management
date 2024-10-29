import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskRootParameters } from './taskDto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {

    constructor(private readonly taskService: TaskService) {}
    
    @Post()
    async create(@Body() task: TaskDto) {
       await this.taskService.create(task);

    }

    @Get('/:id')
    async getTaskById(@Param('id') id: string): Promise<TaskDto> {
        return await this.taskService.findTaskById(id);
    }

    @Get()
    async findAll(@Query() params: FindAllParameters ): Promise<TaskDto[]> {
       return await this.taskService.findAll(params)

    }

    @Put('/:id')
    async updated(@Param() params: TaskRootParameters, @Body() task: TaskDto) {
       await this.taskService.update(params.id, task)
    }

    @Delete('/:id')
    async deleteTaskById(@Param('id') id: string) {
        this.taskService.deleteTaskById(id)
    }
}
