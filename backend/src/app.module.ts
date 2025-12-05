import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Raju@2004',
      database: 'reactbasic',
      synchronize: true,
      entities: [User],
    }),
    UsersModule,
  ],
})
export class AppModule {}
