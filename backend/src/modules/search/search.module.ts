import { Module, CacheModule } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        node: `http://${configService.get('esHost')}:9200`,
      }),
      inject: [ConfigService],
    }),
    CacheModule.register(),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
