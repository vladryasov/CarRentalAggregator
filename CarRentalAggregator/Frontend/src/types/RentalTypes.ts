export enum RentalStatus {
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface RentalDto {
  id: string;
  carId: string;
  userId: string;
  companyId: string;
  startRent: string;
  endRent: string;
  totalPrice: number;
  status: RentalStatus;
  car?: {
    brand: string;
    model: string;
    photos: Array<{
      id: string;
      url: string;
      isPreview: boolean;
    }>;
  };
} 