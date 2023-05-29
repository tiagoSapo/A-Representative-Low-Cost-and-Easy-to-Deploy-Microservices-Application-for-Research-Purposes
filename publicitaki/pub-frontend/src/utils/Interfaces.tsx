export interface IPrices {
  id: number;
  endDate: string;
  startDate: string;
  store: number /* store's id */;
  price: number;

  storeName: string /* store's name */;
  storeUrl: string /* store's url */;
}

export interface IPricesDetails {
  id: number;
  price: number;
  "product-details": {
    brand: string;
    description: string;
    name: string;
    picture: string;
  };
  store: number;
}

export interface IOpinion {
  id: number;
  title: string;
  description: string;
  rating: number;
  customer: number;
  "product-details": {
    brand: string;
    description: string;
    name: string;
    picture: string;
  };

  // for presentation only!
  customerName: string;
}

export interface INotification {
  _id: string;
  title: string;
  description: string;
  date: string;
  operationType: string;
}

export interface IFollowers {
  follower: number;
  product: IProduct;
}

export interface IProduct {
  id: number;
  name: string;
  brand: string;
  description: string;
  picture: string;
}

export interface IVideoGame extends IProduct {
  platform: string;
}

export interface IHomeAppliance extends IProduct {
  dimension: string;
  color: string;
}

export interface IComputer extends IProduct {
  is_laptop: string;
  cpu: string;
  memory: string;
  storage: string;
  screen_resolution: string;
  screen_size: string;
  os: string;
}

export interface IAuthChange {
  authenticated: boolean;
}

export interface IStore {
  _id: string;
  name: string;
  location: string;
  password: string;
  email: string;
  websiteUrl: string;
}

export interface ICustomer {
  _id: string;
  name: string;
  password: string;
  email: string;
}

export interface IFollower {
  id: string;
  product: IProduct;
}

export interface ISubscription {
  id: number;
  expirationDate: string;
  active: string;
  createdAt: string;
  updatedAt: string;
  StoreId: number;
}
