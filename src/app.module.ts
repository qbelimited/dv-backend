import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { DvPlatesModule } from './dv-plates/dv-plates.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    DvPlatesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
