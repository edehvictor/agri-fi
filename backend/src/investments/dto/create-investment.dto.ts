import { IsUUID, IsNumber, IsPositive, IsNotEmpty,  IsInt, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsUUID()
  @IsNotEmpty()
  tradeDealId: string;

  @IsNumber()
  @IsPositive()
  tokenAmount: number;

  @IsNumber()
  @IsPositive()
  amountUsd: number;

  @IsInt()
  @Min(1)
  token_amount: number;
}
