import { Controller, Get, Post, Body, Request, UseGuards, Delete, Put } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { EmailValidationService } from 'src/email-validation/email-validation.service';
import { UsersService } from 'src/users/users.service';
import DeleteUSer from './dto/delete-user.dto';
import { JwtGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UsersService,
        private readonly emailValidationService: EmailValidationService
        ) {}

    @Post("/signup")
    async addUser(
        @Body('password') userPassword: string,
        @Body('username') username: string
    ) {
        
        const result = await this.userService.insertUser(
            username,
            userPassword,
        );
        await this.emailValidationService.sendVerificationLink(username);
        
        return {
            msg: 'User successfully registered',
            userId: result.id,
            username: result.username,
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() req): any {
        if (req.session) {
            console.log("Already logged in")
        }
        return {user: req.user,
                msg: 'user logged in'};
    }

    @UseGuards(JwtGuard)
    @Put('/activate-account')
    async activateAccount(@Body('username') username: string): Promise<any> {
        
        await this.emailValidationService.confirmEmail(username);
    }

    // @UseGuards(JwtGuard)
    @Post('/request-change-password')
    async requestChancePassword(@Body('username') username: string) {
        await this.emailValidationService.sendVerificationLink(username);
    }

    @UseGuards(JwtGuard)
    @Put('/change-password')
    async changePassword(@Body('username') username: string, @Body('password') password: string): Promise<any> {
        await this.userService.updatePassword(username, password);
        
        await this.emailValidationService.sendPasswordChangedConfirmation(username);
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/logout')
    logout(@Request() req): any {
        req.session.destroy();
        return { msg: 'logout successfully'}
    }

    @Delete('/delete')
    async deleteUser(@Body() user: DeleteUSer): Promise<any> {
        await this.userService.deleteUser(user.username)
        return
    }
    
    @UseGuards(AuthenticatedGuard)
    @Get('/protected')
    getHello(@Request() req): string {
        return req.user;
    }
}
