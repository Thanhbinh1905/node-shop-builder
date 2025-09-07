import { Module } from '@nestjs/common';
import { BasketModule } from './modules/basket/basket.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './basket.env',
    }),
    BasketModule,
  ],
})
export class AppModule {}

// TODO: impl kafka