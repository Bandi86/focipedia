import { PartialType } from '@nestjs/mapped-types';
import { CreateOddDto } from './create-odd.dto';

export class UpdateOddDto extends PartialType(CreateOddDto) {}
