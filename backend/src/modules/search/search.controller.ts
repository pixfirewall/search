import { Controller, Get, Logger, Query } from '@nestjs/common';
import { Term } from './search.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  private logger = new Logger('Search Controller');
  constructor(private readonly appService: SearchService) {}

  @Get()
  search(@Query() queryParams: Term): Promise<any> {
    return this.appService.search(queryParams.term);
  }

  @Get('setup')
  setup(): Promise<any> {
    return this.appService.setupEs();
  }

  async onModuleInit() {
    this.logger.log(`Initialization...`);
    const index = await this.appService.checkIndex();
    if (!index) {
      await this.appService.setupEs();
      this.logger.log(`Elasticsearch is initialized.`);
    }
  }
}
