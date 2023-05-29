import React, { useEffect, useState } from "react";
import { Container, Image, Col, Row } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";

// Components
import Header from "../components/Header";
import Footer from "../components/Footer";

// CSS
import "../styles/App.css";

// Pages
import Home from "./Home";
import Computer from "./Computer";
import Playstation from "./Playstation";
import Product from "./Product";
import Opinion from "./Opinion";
import NotFound from "./NotFound";
import Login from "./authentication-pages/Login";
import Register from "./authentication-pages/Register";
import { EMAIL, PASSWORD, ROLE } from "../utils/AuthKeys";
import AccountAdmin from "./account-pages/AccountAdmin";
import AccountCustomer from "./account-pages/AccountCustomer";
import AccountStore from "./account-pages/AccountStore";
import Notifications from "./account-pages/subpage-admin/Notifications";
import ManageProducts from "./account-pages/subpage-admin/ManageProducts";
import EditCustomer from "./account-pages/subpage-customer/EditCustomer";
import FollowedProducts from "./account-pages/subpage-customer/FollowedProducts";
import Xbox from "./Xbox";
import Nintendo from "./Nintento";
import Products from "./Products";
import Videogames from "./Videogames";
import Homeappliances from "./HomeAppliances";
import AddProduct from "./account-pages/subpage-admin/AddProduct";
import NotificationRegistration from "./account-pages/subpage-store/NotificationRegistration";
import StoreProducts from "./account-pages/subpage-store/StoreProducts";
import AddPrice from "./account-pages/subpage-store/AddPrice";
import AccountInfoStore from "./account-pages/subpage-store/AccountInfoStore";
import AddOpinion from "./AddOpinion";
import ManageOpinions from "./account-pages/subpage-customer/ManageOpinions";
import StoreSubscriptionDetails from "./account-pages/subpage-store/SubscriptionDetails";

function App() {
  const [loggedUser, setLoggedUser] = useState(localStorage.getItem(EMAIL));

  /*
   * Check if user was authenticated before
   */
  useEffect(() => {
    if (
      localStorage.getItem(EMAIL) &&
      localStorage.getItem(PASSWORD) &&
      localStorage.getItem(ROLE)
    ) {
      setLoggedUser(localStorage.getItem(EMAIL));
    }
  }, []);

  return (
    <>
      <Header loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
      <main className="centered">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/admin" element={<AccountAdmin />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/manage-products" element={<ManageProducts />} />
          <Route
            path="/admin/manage-products/add-product"
            element={<AddProduct />}
          />

          <Route path="/customer" element={<AccountCustomer />} />
          <Route path="/customer/edit" element={<EditCustomer />} />
          <Route
            path="/customer/followed-products"
            element={<FollowedProducts />}
          />
          <Route path="/customer/opinions" element={<ManageOpinions />} />

          <Route path="/store" element={<AccountStore />} />
          <Route
            path="/store/notification-registration"
            element={<NotificationRegistration />}
          />
          <Route
            path="/store/account-info"
            element={<AccountInfoStore setLoggedUser={setLoggedUser} />}
          />
          <Route path="/store/products" element={<StoreProducts />} />
          <Route path="/store/products/add-price" element={<AddPrice />} />
          <Route
            path="/store/subscription"
            element={<StoreSubscriptionDetails />}
          />

          <Route
            path="/login"
            element={<Login setLoggedUser={setLoggedUser} />}
          />
          <Route
            path="/register"
            element={<Register setLoggedUser={setLoggedUser} />}
          />

          <Route path="/home-appliances" element={<Homeappliances />} />
          <Route path="/computers" element={<Computer />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<Product />} />
          <Route
            path="/products/:productId/opinions/:opinionId"
            element={<Opinion />}
          />
          <Route
            path="/products/:productId/add-opinion"
            element={<AddOpinion />}
          />
          <Route path="/video-games/" element={<Videogames />} />
          <Route path="/video-games/playstation" element={<Playstation />} />
          <Route path="/video-games/xbox" element={<Xbox />} />
          <Route path="/video-games/nintendo" element={<Nintendo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
