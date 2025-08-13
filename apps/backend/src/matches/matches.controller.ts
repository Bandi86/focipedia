import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  create(@Body() createMatchDto: any) {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @Get('public')
  findPublicMatches() {
    return this.matchesService.findPublicMatches();
  }

  @Get('upcoming')
  findUpcomingMatches() {
    return this.matchesService.findUpcomingMatches();
  }

  @Get('live')
  findLiveMatches() {
    return this.matchesService.findLiveMatches();
  }

  @Get('finished')
  findFinishedMatches() {
    return this.matchesService.findFinishedMatches();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }

  @Get(':id/details')
  findMatchDetails(@Param('id') id: string) {
    return this.matchesService.findMatchDetails(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: any) {
    return this.matchesService.update(+id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchesService.remove(+id);
  }
}
