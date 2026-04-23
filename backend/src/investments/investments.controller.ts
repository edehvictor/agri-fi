import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { KycGuard } from '../auth/kyc.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';

@UseGuards(AuthGuard('jwt'))
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @UseGuards(KycGuard, RolesGuard)
  @Roles('investor')
  async createInvestment(
    @Request() req: { user: { id: string; role: string } },
    @Body() createInvestmentDto: CreateInvestmentDto,
  ) {
    return this.investmentsService.createInvestment(
      req.user.id,
      createInvestmentDto,
    );
  }

  @Post(':id/fund')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('investor')
  async fundEscrow(
    @Request() req: { user: { id: string; role: string } },
    @Param('id') id: string,
    @Body('investorWalletAddress') investorWalletAddress: string,
  ) {
    return this.investmentsService.fundEscrow(id, investorWalletAddress);
  }

  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmInvestment(
    @Param('id') id: string,
    @Body('stellarTxId') stellarTxId: string,
  ) {
    return this.investmentsService.confirmInvestment(id, stellarTxId);
  }

  @Get('trade-deal/:tradeDealId')
  async getInvestmentsByTradeDeal(@Param('tradeDealId') tradeDealId: string) {
    return this.investmentsService.getInvestmentsByTradeDeal(tradeDealId);
  }

  @Get('my-investments')
  async getMyInvestments(@Request() req: { user: { id: string } }) {
    return this.investmentsService.getInvestmentsByInvestor(req.user.id);
  }
}
