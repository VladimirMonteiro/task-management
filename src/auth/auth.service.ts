import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './authResponse.dto';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    private jwtExpirationTimeSeconds: number

    constructor(
        private readonly usersService: UsersService, 
        private readonly jtwService: JwtService,
        private readonly configService: ConfigService) {

            this.jwtExpirationTimeSeconds = +this.configService.get<number>('JWT_EXPIRATION_TIME')
        }

    signIn(username: string, password: string): AuthResponseDto{
        const foundUser = this.usersService.findByUsername(username)

        if(!foundUser || !compareSync(password, foundUser.password)){
            throw new UnauthorizedException();
        }

        const payload = { sub: foundUser.id, username: foundUser.username }

        const token = this.jtwService.sign(payload)

        return {token, expiresIn: this.jwtExpirationTimeSeconds}

    }
}
