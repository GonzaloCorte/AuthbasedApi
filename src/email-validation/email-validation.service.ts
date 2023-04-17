import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import EmailService from 'src/email/email.service';
import { JwtokenService } from 'src/jwtoken/jwtoken.service';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class EmailValidationService {
    constructor(
        private readonly jwtokenService: JwtokenService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService,
        private readonly userService: UsersService,
    ) {}

    public async confirmEmail(email: string) {
        const user = await this.userService.getUserByUsername(email);
        if (!user) {
            throw new BadRequestException('Resource not found');
        }
        if (user.active) {
            throw new BadRequestException('Email already confirmed');
        }
        await this.userService.setActivate(email);
    }

    public sendVerificationLink(email: string) {
        
        const token = this.jwtokenService.generateJwt(email);

        const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;
        const text = `Welcome to the application. Please, confirm the email, click here:
        ${url}`;

        return this.emailService.sendMail({
            to: email,
            subject: 'email verification',
            text,
        });
    }

    public sendRequestChangePasswordLink(email: string) {
        const token = this.jwtokenService.generateJwt(email);

        const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;
        const text = `You have requested to change your password. To change your password, click the next link:
        ${url}`
    }

    public sendPasswordChangedConfirmation(email: string) {
        const text = 'Your password have been changed. \n If it wasn\'t you... Well, you can pray °_°'

        return this.emailService.sendMail({
            to: email,
            subject: 'Password changed',
            text,
        })
    }
}

