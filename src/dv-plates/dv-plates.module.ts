import { Module } from '@nestjs/common';
import { DVSerialService } from './dv-plates.service';
import { DVSerialController } from './dv-plates.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [DVSerialService],
  controllers: [DVSerialController],
  imports: [PrismaModule]
})
export class DvPlatesModule {}
