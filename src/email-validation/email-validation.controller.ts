import { ClassSerializerInterceptor, Controller, UseInterceptors, Body, Post, Req, UseGuards, NotFoundException, HttpStatus } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import ConfirEmailDto from './dto/confirmEmail.dto';
import { JwtokenService } from 'src/jwtoken/jwtoken.service';

@Controller('email-validation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailValidationController {
    constructor(
        private readonly jwtokenService: JwtokenService,
    ) {}

    @Get(['hello', '/hello'])
    getHello(): string {
        return 'Hello World'
    }

    @Post('/validate-email-token')
    async confirm(@Body() validationData: ConfirEmailDto) {
        const email = await this.jwtokenService
            .decodeValidationToken(validationData.token);
        if (!email) {
            throw new NotFoundException('resource not found')
        }
    }

    // @Post('/validate-change-password')
    // async validateChangePassword(validationData: ConfirEmailDto) {
    //     const email = await this.emailValidationService
    //         .decodeValidationToken(validationData.token);

    //     return HttpStatus.ACCEPTED;
    // }

    // @Post('resend-validation-link')
    // async resendValidationLink(@Req() request: ) {

    //     await this.emailValidationService.sendVerificationLink(username);
    // }
}
