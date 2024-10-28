import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { FindAllParameters, TaskDto } from './taskDto';

@Injectable()
export class TaskService {

    private tasks: TaskDto[] = [];

    create(task: TaskDto) {
        this.tasks.push(task);
        console.log(this.tasks);

    }

    findTaskById(id: string): TaskDto {
        
       const task = this.tasks.filter(task => task.id === id)

       if(task.length) {

        return task[0];
       } else {
        throw new NotFoundException(`task with ${id} not found.`)
       }

    }

    update(task: TaskDto) {
        
        let taskIndex = this.tasks.findIndex(task => task.id === task.id);

        if(taskIndex >= 0) {
            this.tasks[taskIndex] = task
            return
        }

        throw new HttpException('Task not found', HttpStatus.BAD_REQUEST)
    }

    deleteTaskById(id: string) {

        let taskIndex = this.tasks.findIndex(task => task.id === id)

        if(taskIndex >= 0) {
            this.tasks.splice(taskIndex, 1)
            return
        }

        throw new HttpException(`task with ${id} not found`, HttpStatus.NOT_FOUND)
        

    }

    findAll(params: FindAllParameters): TaskDto[]{

        return this.tasks.filter(task =>  {
            let macth = true

            if(params.title !== undefined && !task.title.includes(params.title)) {
                macth = false
            }

            if(params.status !== undefined && !task.title.includes(params.status)) {
                macth = false
            }

            return macth;
        })

    }


}
