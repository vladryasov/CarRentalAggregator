export interface CarPhotoDto {
  id: string;
  url: string;
  isPreview: boolean;
}

export interface CarDto {
  id: string;
  brand: string;
  model: string;
  description: string;
  engineCapacity: number;
  enginePower: number;
  engineType: string; 
  priceForOneDay: number;
  companyId: string;
  photos: CarPhotoDto[];
}