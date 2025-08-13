import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerTrophyDto } from './create-player-trophy.dto';

export class UpdatePlayerTrophyDto extends PartialType(CreatePlayerTrophyDto) {}
