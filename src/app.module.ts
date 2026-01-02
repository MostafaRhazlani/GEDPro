import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost/GEDPro'),
    OrganizationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
