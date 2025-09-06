import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceService } from './modules/service/service.service';
import { ControllerController } from './modules/controller/controller.controller';

@Module({
  imports: [],
  controllers: [AppController, ControllerController],
  providers: [AppService, ServiceService],
})
export class AppModule {}
