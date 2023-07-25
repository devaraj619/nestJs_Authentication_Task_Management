import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`]
    }),
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres', //DataBase Type
      host: '', //DataBase Host
      database: '', //DataBase Name
      port: 5432, //DataBase Port
      username: '', //Username
      password: '', //Password
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
