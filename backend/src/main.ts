import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 👈 Agregá esta línea
  app.enableCors({ origin: 'http://localhost:5173' });
  await app.listen(5000);
  console.log('Servidor corriendo en puerto 5000');
}
void bootstrap();
