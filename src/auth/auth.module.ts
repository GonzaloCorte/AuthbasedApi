import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session.serializer';
import { AuthController } from './auth.controller';
import { EmailValidationModule } from 'src/email-validation/email-validation.module';
import { JwtokenModule } from 'src/jwtoken/jwtoken.module';

@Module({
  imports: [PassportModule.register({ session: true }),EmailValidationModule, UsersModule, JwtokenModule],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthController]
})
export class AuthModule {}
