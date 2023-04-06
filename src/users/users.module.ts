import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose"
import { UsersService } from './users.service';
import { UserSchema } from './entities/users.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name : "user", schema: UserSchema}])],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
