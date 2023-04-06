import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { EmailValidationController } from './email-validation.controller';
import { EmailValidationService } from './email-validation.service';
import { JwtokenModule } from 'src/jwtoken/jwtoken.module';

@Module({
  imports: [UsersModule, EmailModule, ConfigModule, JwtokenModule
  ],
  controllers: [EmailValidationController],
  providers: [EmailValidationService],
  exports: [EmailValidationService]
})
export class EmailValidationModule {}
