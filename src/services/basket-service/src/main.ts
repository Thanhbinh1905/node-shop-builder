import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.get<string>('KAFKA_CLIENT_ID') || 'inventory-service',
        brokers: (config.get<string>('KAFKA_BROKERS') || 'localhost:9092').split(','),
      },
      consumer: {
        groupId: config.get<string>('KAFKA_GROUP_ID') || 'inventory-group',
      },
    },
  });
  
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Enable CORS
  app.enableCors();
  
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Product Service is running on: ${await app.getUrl()}`);
}
bootstrap();
