
import { IsOptional, IsString, IsUUID, MinLength } from "class-validator"

export class UserDto {

    @IsUUID()
    @IsOptional()
    id: string

    @IsString()
    username: string

    @IsString()
    @MinLength(3)
    password?: string
}