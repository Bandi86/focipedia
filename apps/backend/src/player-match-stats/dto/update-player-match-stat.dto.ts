import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerMatchStatDto } from './create-player-match-stat.dto';

export class UpdatePlayerMatchStatDto extends PartialType(CreatePlayerMatchStatDto) {}
