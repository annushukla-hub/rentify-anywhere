export type RentalCategory = 'property' | 'vehicle' | 'equipment' | 'electronics';

export type PropertyType = 'apartment' | 'house' | 'condo' | 'studio' | 'villa' | 'townhouse';
export type VehicleType = 'car' | 'truck' | 'motorcycle' | 'suv' | 'luxury' | 'rv' | 'boat' | 'bicycle';
export type EquipmentType = 'construction' | 'photography' | 'audio' | 'sports' | 'tools' | 'party';
export type ElectronicsType = 'laptop' | 'camera' | 'phone' | 'console' | 'tablet';

export type RentalCondition = 'new' | 'excellent' | 'good' | 'fair';
export type RentalDuration = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type ListingType = 'rent' | 'buy' | 'both';

export interface RentalFeature {
  icon: string;
  label: string;
}

export interface RentalItem {
  id: string;
  title: string;
  description: string;
  category: RentalCategory;
  subCategory: PropertyType | VehicleType | EquipmentType | ElectronicsType;
  listingType: ListingType;
  price: number;
  priceUnit: RentalDuration;
  buyPrice?: number;
  location: string;
  distance?: number;
  rating: number;
  reviewCount: number;
  image: string;
  condition: RentalCondition;
  features: RentalFeature[];
  hasDelivery: boolean;
  hasInsurance: boolean;
  instantBooking: boolean;
  owner: {
    name: string;
    avatar: string;
    verified: boolean;
  };
}

export interface SearchFilters {
  category?: RentalCategory;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  duration?: RentalDuration;
  condition?: RentalCondition[];
  minRating?: number;
  features?: string[];
  distance?: number;
}

export interface SortOption {
  value: string;
  label: string;
}
