import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Team created',
    schema: {
      example: { id: 1, name: 'FC Example', country: 'HU', stadium: 'Example Arena', logoUrl: null, founded: 1909 },
    },
  })
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'desc', enum: ['asc', 'desc'] })
  @ApiOkResponse({
    description: 'List teams (paginated)',
    schema: {
      example: [
        { id: 1, name: 'FC Example', country: 'HU', stadium: 'Example Arena', logoUrl: null, founded: 1909 },
        { id: 2, name: 'Budapest United', country: 'HU', stadium: null, logoUrl: null, founded: 1920 },
      ],
    },
  })
  findAll(@Query() q: PaginationDto) {
    return this.teamsService.findAll(q);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get team by id',
    schema: { example: { id: 1, name: 'FC Example', country: 'HU', stadium: 'Example Arena', logoUrl: null, founded: 1909 } },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.remove(id);
  }

  @Get(':id/form')
  recentForm(@Param('id', ParseIntPipe) id: number, @Query('limit') limit?: string) {
    const n = limit ? Number(limit) : 5;
    return this.teamsService.recentForm(id, Number.isFinite(n) ? n : 5);
  }
}
