import { Module } from '@nestjs/common';
import { DrizzleModule } from './modules/drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    DrizzleModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
