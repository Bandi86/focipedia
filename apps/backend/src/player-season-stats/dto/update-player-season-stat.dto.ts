import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerSeasonStatDto } from './create-player-season-stat.dto';

export class UpdatePlayerSeasonStatDto extends PartialType(CreatePlayerSeasonStatDto) {}
