import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
// import MongoStore from 'connect-mongo';
// const MongoStore = require('connect-mongodb-session')(session)
const MongoStore = require('connect-mongo');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({ credentials: true, origin: true });
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      // store: store,
      store: MongoStore.create({
        mongoUrl: configService.get<string>('MONGODB_URI'),
        collection: 'sessions'
      }),
      cookie: { secure: false, httpOnly: true, sameSite: 'strict' },
    })
  )
  
  app.use(passport.initialize())
  app.use(passport.session())
  
  const port = configService.get('APP_PORT');

  await app.listen(port);
}
bootstrap();