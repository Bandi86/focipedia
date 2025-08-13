import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

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
