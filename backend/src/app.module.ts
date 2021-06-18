import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from './modules/search/search.module';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    SearchModule,
  ],
})
export class AppModule {}
