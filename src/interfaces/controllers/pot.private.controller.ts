import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { PotTokenGuard } from '../common/guards/pot-token.guard';
import { EditPotDto } from '../dto/pot.dto';
import { UpdatePotUseCase } from 'src/application/usecases/pot';
import { PotEntity } from 'src/domain/entities/pot.entity';
import { PotRequest } from '../common/types/pot.type';
import { GetPotCommandsUseCase } from 'src/application/usecases/pot';

@Controller('pot/private')
export class PotPrivateController {
  constructor(
    private readonly updatePotUseCase: UpdatePotUseCase,
    private readonly getPotCommandsUseCase: GetPotCommandsUseCase,
  ) {}

  @UseGuards(PotTokenGuard)
  @Put('data')
  async uploadData(@Req() req: PotRequest, @Body() body: EditPotDto) {
    const pot = req.pot;

    const data = await this.updatePotUseCase.execute(
      pot.id!,
      new PotEntity(
        pot.id,
        pot.userId,
        pot.name,
        body.temperature,
        body.humidity,
        body.soilMoisture,
        body.photoresistor,
        body.waterSensor,
        body.vitaminSensor,
        body.PHValue,
        body.timestamp,
      ),
    );

    return data;
  }

  @UseGuards(PotTokenGuard)
  @Get('commands')
  async getCommands(@Req() req: PotRequest) {
    const pot = req.pot;
    return this.getPotCommandsUseCase.execute(pot.id!);
  }
}
