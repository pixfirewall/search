import { Chance } from 'chance';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Inject, Injectable, Logger, CACHE_MANAGER } from '@nestjs/common';

@Injectable()
export class SearchService {
  private logger = new Logger('Search Service');
  private esIdex;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {
    this.esIdex = this.configService.get('esIndex');
  }

  async search(term: string): Promise<any> {
    this.logger.log(`searching for ${term}`);
    const cachedValue: string = await this.cacheManager.get(term);
    if (cachedValue) return JSON.parse(cachedValue);
    const result = await this.elasticsearchService.search({
      index: this.esIdex,
      body: {
        query: {
          query_string: {
            query: `*${term}*`,
            fields: ['title'],
          },
        },
      },
    });
    const {
      body: {
        hits: { total, hits },
      },
    } = result;
    const response = {
      total: total.value,
      results: hits.map((item) => item._source.title),
    };
    await this.cacheManager.set(term, JSON.stringify(response), { ttl: 25 });
    return response;
  }

  async checkIndex(): Promise<boolean> {
    this.logger.log(`checking for ${this.esIdex} index to be available.`);
    try {
      const {
        body: { count },
      } = await this.elasticsearchService.count({
        index: this.esIdex,
      });
      if (!count) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  async setupEs(): Promise<any> {
    this.logger.log(`setting up ES for ${this.esIdex} index.`);
    this.elasticsearchService.indices.create(
      {
        index: this.esIdex,
        body: {
          mappings: {
            properties: {
              title: { type: 'text' },
            },
          },
        },
      },
      { ignore: [400] },
    );

    const chance = new Chance();
    const dataSet = new Set();
    while (dataSet.size < 500) {
      dataSet.add(chance.company());
    }
    const body = [...dataSet].flatMap((title) => [
      { index: { _index: this.esIdex } },
      { title },
    ]);

    const { body: bulkResponse } = await this.elasticsearchService.bulk({
      refresh: true,
      body,
    });

    return bulkResponse;
  }
}
