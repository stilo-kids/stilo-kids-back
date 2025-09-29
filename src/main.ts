import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const documentBuilder = new DocumentBuilder()
    .setTitle('Stilo Kids API')
    .setDescription(
      'API para o aplicativo de gestão de loja de roupas infantis Stilo Kids',
    )
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const documentFactory = () =>
    SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
