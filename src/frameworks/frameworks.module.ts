import { Module } from '@nestjs/common';
import { FrameworkController } from './frameworks.controller';
import { FrameworkService } from './frameworks.service';
import { FrameworkSchema } from '../Models/framework.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GuidelineSchema } from '../Models/guideline.schema';

@Module({
  imports: [
      ConfigModule,
      MongooseModule.forFeature([{ name: 'Framework', schema: FrameworkSchema }], 'frameworkDB'),
      MongooseModule.forFeature([{ name: 'Guideline', schema: GuidelineSchema }], 'frameworkDB'),
  ],
  controllers: [FrameworkController],
  providers: [FrameworkService],
})
export class FrameworkModule {}