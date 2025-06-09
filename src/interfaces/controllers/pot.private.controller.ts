import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { PotTokenGuard } from '../common/guards/pot-token.guard';
import { EditPotDto } from '../dto/pot.dto';
import { UpdatePotUseCase } from 'src/application/usecases/pot';
import { PotEntity } from 'src/domain/entities/pot.entity';
import { PotRequest } from '../common/types/pot.type';

@Controller('pot/private')
export class PotPrivateController {
  constructor(private readonly updatePotUseCase: UpdatePotUseCase) {}

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
}
