import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierModule } from './suppliers/supplier.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './products/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port:
        process.env.DATABASE_PORT == undefined
          ? 3306
          : parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      // autoLoadEntities: true,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
    }),
    SupplierModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
