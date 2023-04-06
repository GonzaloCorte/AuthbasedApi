import { Module } from '@nestjs/common';
import { JwtokenService } from './jwtoken.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule, ConfigModule],
  providers: [JwtokenService],
  exports: [JwtokenService]
})
export class JwtokenModule {}
