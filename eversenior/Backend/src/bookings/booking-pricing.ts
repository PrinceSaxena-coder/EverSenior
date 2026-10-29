
import { BookingServiceType } from './dto/create-booking.dto';

export const BOOKING_PRICES: Record<BookingServiceType, number> = {
  [BookingServiceType.SOCIAL]: 499,
  [BookingServiceType.OUTING]: 599,
  [BookingServiceType.HOBBIES]: 549,
  [BookingServiceType.SUPPORT]: 649,
  [BookingServiceType.TECH]: 599,
  [BookingServiceType.TRAVEL]: 999,
};

export function calculateBookingPrice(
  serviceType: BookingServiceType,
  durationMinutes: number,
): number {
  const hourlyPrice = BOOKING_PRICES[serviceType];

  if (!hourlyPrice || durationMinutes <= 0) {
    throw new Error('Invalid service or booking duration');
  }

  return Math.round((hourlyPrice * durationMinutes) / 60 * 100) / 100;
}
