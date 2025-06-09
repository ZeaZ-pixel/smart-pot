import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import {
  ConnectPotUseCase,
  DeletePotUseCase,
  EditPotUseCase,
  GetUserPotsUseCase,
  CreatePotCommandUseCase,
} from 'src/application/usecases/pot';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/types/auth.type';
import {
  ConnectPotDto,
  CreatePotCommandDto,
  EditPotImageDto,
} from '../dto/pot.dto';
import { PotEntity } from 'src/domain/entities/pot.entity';
import { PotCommandEntity } from 'src/domain/entities/pot-command.entity';

@Controller('pot')
export class PotController {
  constructor(
    private readonly createPotCommandUseCase: CreatePotCommandUseCase,
    private readonly deletePotUseCase: DeletePotUseCase,
    private readonly editPotUseCase: EditPotUseCase,
    private readonly connectPotUseCase: ConnectPotUseCase,
    private readonly getUserPotsUseCase: GetUserPotsUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put('/:potId/image')
  async editPotImage(
    @Param('potId') potId: number,
    @Request() req: AuthenticatedRequest,
    @Body() dto: EditPotImageDto,
  ): Promise<PotEntity> {
    return this.editPotUseCase.execute(req.user.id!, potId, dto.imageBase64);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:potId/command')
  createCommand(
    @Param('potId') potId: number,
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreatePotCommandDto,
  ): Promise<PotCommandEntity> {
    return this.createPotCommandUseCase.execute(
      req.user.id!,
      potId,
      dto.type,
      dto.payload,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('connect')
  async connectPot(
    @Request() req: AuthenticatedRequest,
    @Body() dto: ConnectPotDto,
  ): Promise<PotEntity> {
    return this.connectPotUseCase.execute(dto.name, dto.password, req.user.id!);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPots(@Request() req: AuthenticatedRequest): Promise<PotEntity[]> {
    return this.getUserPotsUseCase.execute(req.user.id!);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePot(
    @Request() req: AuthenticatedRequest,
    @Param('id') potId: number,
  ): Promise<PotEntity | null> {
    return this.deletePotUseCase.execute(req.user.id!, potId);
  }
}
