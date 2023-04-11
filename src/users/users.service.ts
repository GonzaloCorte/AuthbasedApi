import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/users.entity';
import { validate } from 'deep-email-validator';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
    constructor(@InjectModel('user') private readonly userModel: Model<User>) {}
    async insertUser(userName: string, password: string) {
        const res = await validate(userName);
        if (!res.valid) {
            throw new NotAcceptableException('username not valid')
        }
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);

        const username = userName.toString().toLowerCase();
        const newUser = new this.userModel({
            username,
            password: hashedPassword,
            active: false,
        });
        try {
            await newUser.save();
        }catch(e) {
            console.log(e);
            return null;
        }

        return newUser;
    }
    async getUserByUsername(userName: string): Promise<User>{
        const username = userName.toString().toLowerCase();
        const user = await this.userModel.findOne({ username });
        return user;
    }

    async updatePassword(username: string, password: string): Promise<any> {
        username = username.toString().toLowerCase();
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        await this.userModel.findOneAndUpdate({username}, {hashedPassword, updatedAt: Date.now()})
    }

    async deleteUser(username: string) {
        await this.userModel.findOneAndRemove({ username });
    }

    async setActivate(username: string) {
        const user = await this.userModel.findOne({ username });
        if (!user) {
            throw new NotFoundException('account doesn\'t exists')
        }
        await this.userModel.updateOne({username}, {active: true})
    }
}

