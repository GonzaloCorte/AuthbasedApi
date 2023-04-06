import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common/exceptions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) {}

    async validateUser(username: string, password: string): Promise<any> {
        username = username.toString().toLowerCase();
        const user = await this.userService.getUserByUsername(username);
        if (!user) {
            throw new BadRequestException('username or password not valid')
        }
        const passwordValid = await bcrypt.compare(password, user.password)
        if (!passwordValid) {
            throw new BadRequestException('username or password not valid')
        }
        return {
            userId: uuidv4(),
            username: user.username
        }
    }

    async checkUserExists(username: string): Promise<boolean> {
        const user = await this.userService.getUserByUsername(username);
        if (!user) {
            throw new BadRequestException('username or password not valid')
        }
        return true
    }
}
