export interface Hall {
  _id: string;
  name: string;
  description?: string;
  location: string;
  city: string;
  address?: string;
  capacity: number;
  price: number;
  amenities: string[];
  images: string[];
  owner: { _id: string; name: string; phone: string };
  managedBy?: { _id: string; name: string; phone: string };
  isActive: boolean;
  blockedDates: string[];
  createdAt: string;
}

export interface HallFormData {
  name: string;
  description: string;
  location: string;
  city: string;
  address: string;
  capacity: number;
  price: number;
  amenities: string[];
  images: string[];
  ownerPhone: string;
}