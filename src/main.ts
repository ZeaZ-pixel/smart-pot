import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigModule } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  ConfigModule.forRoot({
    isGlobal: true,
    load: [() => ({
      resetPassword: {
        code: {
          expiresInSeconds: parseInt(process.env.RESET_PASSWORD_CODE_EXPIRES_IN_SECONDS || '600'),
          maxAttempts: parseInt(process.env.RESET_PASSWORD_MAX_ATTEMPTS || '5')
        }
      }
    })]
  });
  const config = new DocumentBuilder()
    .setTitle('API документация')
    .setDescription('Автоматически сгенерированная Swagger документация')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
