import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'matchDate' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'desc', enum: ['asc', 'desc'] })
  @ApiOkResponse({
    description: 'List matches (paginated)',
    schema: {
      example: [
        { id: 1, leagueId: 1, matchDate: '2025-08-13T19:00:00.000Z', homeTeamId: 1, awayTeamId: 2, status: 'Scheduled' },
        { id: 2, leagueId: 1, matchDate: '2025-08-14T19:00:00.000Z', homeTeamId: 3, awayTeamId: 4, status: 'Live' },
      ],
    },
  })
  findAll(@Query() q: PaginationDto, @Query('leagueId') leagueId?: string) {
    const lid = leagueId ? Number(leagueId) : undefined;
    return this.matchesService.findAll(q, lid);
  }

  @Get('public')
  @ApiOkResponse({ description: 'Public matches', schema: { example: [] } })
  findPublicMatches() {
    return this.matchesService.findPublicMatches();
  }

  @Get('upcoming')
  @ApiOkResponse({ description: 'Upcoming matches', schema: { example: [] } })
  findUpcomingMatches() {
    return this.matchesService.findUpcomingMatches();
  }

  @Get('live')
  @ApiOkResponse({ description: 'Live matches', schema: { example: [] } })
  findLiveMatches() {
    return this.matchesService.findLiveMatches();
  }

  @Get('finished')
  @ApiOkResponse({ description: 'Finished matches', schema: { example: [] } })
  findFinishedMatches() {
    return this.matchesService.findFinishedMatches();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchesService.findOne(id);
  }

  @Get(':id/details')
  findMatchDetails(@Param('id', ParseIntPipe) id: number) {
    return this.matchesService.findMatchDetails(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matchesService.remove(id);
  }
}
