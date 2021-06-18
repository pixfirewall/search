import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class Term {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly term: string;
}
