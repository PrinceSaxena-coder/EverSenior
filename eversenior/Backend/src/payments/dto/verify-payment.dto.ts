import {
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class VerifyPaymentDto {
  @IsMongoId()
  paymentId!: string;

  @IsString()
  @IsNotEmpty()
  razorpayPaymentId!: string;

  @IsString()
  @IsNotEmpty()
  razorpayOrderId!: string;

  @IsString()
  @IsNotEmpty()
  razorpaySignature!: string;
}
