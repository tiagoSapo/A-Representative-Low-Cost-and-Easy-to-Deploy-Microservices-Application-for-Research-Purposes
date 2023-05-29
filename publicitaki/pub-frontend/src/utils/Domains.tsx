// Server URL
const PRODUCTS_SERVER_DOMAIN =
  "http://" + import.meta.env.VITE_PRODUCTS_URL || "http://localhost:7005";
const USERS_SERVER_DOMAIN =
  "http://" + import.meta.env.VITE_USERS_URL || "http://localhost:7003";
const NOTIFICATIONS_SERVER_DOMAIN =
  "http://" + import.meta.env.VITE_NOTIFICATIONS_URL || "http://localhost:7001";

console.log(PRODUCTS_SERVER_DOMAIN);
console.log(USERS_SERVER_DOMAIN);
console.log(NOTIFICATIONS_SERVER_DOMAIN);

// GET URLs
const playstation_get =
  PRODUCTS_SERVER_DOMAIN + "/products/videogames?platf=playstation";
const xbox_get = PRODUCTS_SERVER_DOMAIN + "/products/videogames?platf=xbox";
const nintendo_get =
  PRODUCTS_SERVER_DOMAIN + "/products/videogames?platf=nintendo";

// Products
const GetProductsById = (productId: string | undefined) => {
  return PRODUCTS_SERVER_DOMAIN + "/products/" + productId;
};

const GetProducts = () => {
  return PRODUCTS_SERVER_DOMAIN + "/products";
};
const DeleteProduct = (id: number) => {
  return PRODUCTS_SERVER_DOMAIN + "/products/" + id;
};
const GetPlaystationProducts = () => {
  return PRODUCTS_SERVER_DOMAIN + "/products/videogames?platf=Playstation";
};
const GetVideogames = () => {
  return PRODUCTS_SERVER_DOMAIN + "/products/videogames";
};
const GetXboxProducts = () => {
  return PRODUCTS_SERVER_DOMAIN + "/products/videogames?platf=Xbox";
};
const GetNintendoProducts = () => {
  return PRODUCTS_SERVER_DOMAIN + "/products/videogames?platf=Nintendo";
};
const GetHomeAppliances = () => {
  return PRODUCTS_SERVER_DOMAIN + "/products/home-appliances";
};
const GetComputers = () => {
  return PRODUCTS_SERVER_DOMAIN + "/products/computers";
};

const GetImages = (imageName: string | undefined) => {
  return PRODUCTS_SERVER_DOMAIN + "/images/" + imageName;
};

const CheckCustomer = () => {
  return USERS_SERVER_DOMAIN + "/customers/check-exists";
};

const CheckStore = () => {
  return USERS_SERVER_DOMAIN + "/stores/check-exists";
};

const GetAdminNotifications = () => {
  return NOTIFICATIONS_SERVER_DOMAIN + "/notifications-admin";
};

const DeleteAdminNotification = (id: string) => {
  return NOTIFICATIONS_SERVER_DOMAIN + "/notifications-admin/" + id;
};

const GetNotifications = () => {
  return NOTIFICATIONS_SERVER_DOMAIN + "/notifications";
};

const PostHomeAppliance = () => {
  return PRODUCTS_SERVER_DOMAIN + "/products/home-appliances";
};
const PostComputer = () => {
  return PRODUCTS_SERVER_DOMAIN + "/products/computers";
};
const PostVideogame = () => {
  return PRODUCTS_SERVER_DOMAIN + "/products/videogames";
};
const PostProduct = () => {
  return PRODUCTS_SERVER_DOMAIN + "/products";
};
const PostAdminNotification = () => {
  return NOTIFICATIONS_SERVER_DOMAIN + "/notifications-admin";
};

const PostStoreUser = () => {
  return USERS_SERVER_DOMAIN + "/stores";
};
const PostCustomerUser = () => {
  return USERS_SERVER_DOMAIN + "/customers";
};

const GetStoreByEmail = (email: string | null) => {
  return USERS_SERVER_DOMAIN + "/stores/email/" + email;
};

const GetStoreById = (id: number) => {
  return USERS_SERVER_DOMAIN + "/stores/" + id;
};

const GetStoreProducts = (storeId: string) => {
  return PRODUCTS_SERVER_DOMAIN + "/stores/" + storeId + "/prices";
};

const GetStoreProductsWithoutPrice = (storeId: string | null) => {
  return (
    PRODUCTS_SERVER_DOMAIN + "/stores/" + storeId + "/products-without-price"
  );
};

const PostPriceForStore = (
  storeId: string | null,
  productId: string | undefined
) => {
  return (
    PRODUCTS_SERVER_DOMAIN +
    "/stores/" +
    storeId +
    "/product/" +
    productId +
    "/price"
  );
};

const CheckCustomerId = (email: string) => {
  return USERS_SERVER_DOMAIN + "/customers/email/" + email + "/id";
};
const CheckStoreId = (email: string) => {
  return USERS_SERVER_DOMAIN + "/stores/email/" + email + "/id";
};

const DeletePrice = (id: number | null) => {
  return PRODUCTS_SERVER_DOMAIN + "/prices/" + id;
};

const UpdateStoreByEmail = (email: string | null) => {
  return USERS_SERVER_DOMAIN + "/stores/email/" + email;
};

const UpdateCustomerByEmail = (email: string | null) => {
  return USERS_SERVER_DOMAIN + "/customers/email/" + email;
};

const GetProductPrices = (id: string | undefined) => {
  return PRODUCTS_SERVER_DOMAIN + "/prices/products/" + id;
};

const DeleteStore = (id: string | undefined) => {
  return USERS_SERVER_DOMAIN + "/stores/" + id;
};

const DeleteStorePrices = (id: string | undefined) => {
  return PRODUCTS_SERVER_DOMAIN + "/stores/" + id + "/prices";
};

const GetCustomerByEmail = (email: string | null) => {
  return USERS_SERVER_DOMAIN + "/customers/email/" + email;
};

const PostOpinion = (productId: string | null, customerId: string | null) => {
  return (
    PRODUCTS_SERVER_DOMAIN +
    "/opinions/products/" +
    productId +
    "/customer/" +
    customerId
  );
};

const GetOpinion = (opinionId: string | null | undefined) => {
  return PRODUCTS_SERVER_DOMAIN + "/opinions/" + opinionId;
};

const GetCustomerById = (id: string | null | undefined) => {
  return USERS_SERVER_DOMAIN + "/customers/" + id;
};

const GetOpinionsByCustomer = (customerId: string | null | undefined) => {
  return PRODUCTS_SERVER_DOMAIN + "/opinions/customers/" + customerId;
};

const DeleteOpinion = (opinionId: string | null | undefined) => {
  return PRODUCTS_SERVER_DOMAIN + "/opinions/" + opinionId;
};

const GetProductOpinions = (productId: string | null | undefined) => {
  return PRODUCTS_SERVER_DOMAIN + "/opinions/products/" + productId;
};

const GetProductFollowers = (productId: string | null | undefined) => {
  return PRODUCTS_SERVER_DOMAIN + "/products/" + productId + "/followers";
};

const FollowProduct = (
  productId: string | null | undefined,
  followerId: string | null | undefined
) => {
  return (
    PRODUCTS_SERVER_DOMAIN +
    "/products/" +
    productId +
    "/followers/" +
    followerId
  );
};

const UnfollowProduct = (
  productId: string | null | undefined,
  followerId: string | null | undefined
) => {
  return (
    PRODUCTS_SERVER_DOMAIN +
    "/products/" +
    productId +
    "/followers/" +
    followerId
  );
};

const GetFollowerProducts = (followerId: string | null | undefined) => {
  return PRODUCTS_SERVER_DOMAIN + "/followers/" + followerId;
};

const GetStoreSubscription = (storeEmail: string | null | undefined) => {
  return USERS_SERVER_DOMAIN + "/subscriptions/store/email/" + storeEmail;
};

const PaySubscription = (storeEmail: string | null | undefined) => {
  return (
    USERS_SERVER_DOMAIN +
    "/subscriptions/pay-subscription/store/email/" +
    storeEmail
  );
};

export default {
  PRODUCTS_SERVER_DOMAIN,
  USERS_SERVER_DOMAIN,
  NOTIFICATIONS_SERVER_DOMAIN,
  playstation_get,
  xbox_get,
  nintendo_get,
  GetProductsById,
  GetProducts,
  GetImages,
  CheckCustomer,
  CheckStore,
  GetAdminNotifications,
  GetPlaystationProducts,
  GetXboxProducts,
  GetNintendoProducts,
  GetVideogames,
  GetHomeAppliances,
  GetComputers,
  DeleteProduct,
  DeleteAdminNotification,
  GetNotifications,
  PostHomeAppliance,
  PostComputer,
  PostVideogame,
  PostProduct,
  PostAdminNotification,
  PostStoreUser,
  PostCustomerUser,
  GetStoreByEmail,
  GetStoreProducts,
  PostPriceForStore,
  CheckCustomerId,
  CheckStoreId,
  GetStoreProductsWithoutPrice,
  DeletePrice,
  UpdateStoreByEmail,
  GetStoreById,
  GetProductPrices,
  DeleteStore,
  DeleteStorePrices,
  GetCustomerByEmail,
  UpdateCustomerByEmail,
  PostOpinion,
  GetOpinion,
  GetCustomerById,
  GetOpinionsByCustomer,
  DeleteOpinion,
  GetProductOpinions,
  GetProductFollowers,
  UnfollowProduct,
  FollowProduct,
  GetFollowerProducts,
  GetStoreSubscription,
  PaySubscription,
};
