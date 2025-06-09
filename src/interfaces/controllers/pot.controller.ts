import { Controller, Delete, Param, Request, UseGuards } from '@nestjs/common';

import {
  CreatePotUseCase,
  DeletePotUseCase,
  EditPotUseCase,
} from 'src/application/usecases/pot';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/types/auth.type';

@Controller('pot')
export class PotController {
  constructor(
    private readonly createPotUseCase: CreatePotUseCase,
    private readonly deletePotUseCase: DeletePotUseCase,
    private readonly editPotUseCase: EditPotUseCase,
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @Patch('edit/:id')
  // async editPot(
  //   @Request() req: AuthenticatedRequest,
  //   @Body() dto: EditPotDto,
  //   @Param('id') potId: number,
  // ): Promise<PotEntity> {
  //   return this.editPotUseCase.execute(
  //     req.user.id!,
  //     potId,
  //     new PotEntity(
  //       null,
  //       req.user.id,
  //       dto.name,
  //       dto.temperature,
  //       dto.humidity,
  //       dto.soilMoisture,
  //       dto.photoresistor,
  //       dto.waterSensor,
  //       dto.vitaminSensor,
  //       dto.PHValue,
  //     ),
  //   );
  // }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deletePot(
    @Request() req: AuthenticatedRequest,
    @Param('id') potId: number,
  ): Promise<number | null> {
    return this.deletePotUseCase.execute(req.user.id!, potId);
  }
}
