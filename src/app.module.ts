import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EmailValidationModule } from './email-validation/email-validation.module';
import * as Joi from '@hapi/joi'
import { JwtokenModule } from './jwtoken/jwtoken.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
      })
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required(),
      })
    }),
    UsersModule,
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://administrator:H1Uubiqicj5oUPn8@cluster0.tmxg224.mongodb.net/?retryWrites=true&w=majority'
    ),
    EmailModule,
    EmailValidationModule,
    JwtModule,
    JwtokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
