import React, { useState } from "react";
import './App.css';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js"
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from "./component/User/LoginSignup";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import Payment from "./component/Cart/Payment";
import OrderSuccess from "./component/Cart/OrderSuccess";
import axios from "axios";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UserList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";



function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans"]
      }
    })

    store.dispatch(loadUser());

    getStripeApiKey();
  }, [])

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
        {isAuthenticated && <Route exact path="/account" element={<Profile />} />}
        {isAuthenticated && <Route exact path="/me/update" element={<UpdateProfile />} />}
        {isAuthenticated && <Route exact path="/password/update" element={<UpdatePassword />} />}
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        {isAuthenticated && <Route exact path="/orders" element={<MyOrders />} />}
        {isAuthenticated && <Route exact path="/order/:id" element={<OrderDetails />} />}
        <Route exact path="/login" element={<LoginSignUp />} />
        <Route exact path="/cart" element={<Cart />} />
        {isAuthenticated && <Route exact path="/login/shipping" element={<Shipping />} />}
        {isAuthenticated && <Route exact path="/order/confirm" element={<ConfirmOrder />} />}
        {isAuthenticated && <Route exact path="/success" element={<OrderSuccess />} />}
        {isAuthenticated && <Route path="/admin/dashboard" element={<Dashboard/>} />}
        {isAuthenticated && <Route path="/admin/products" element={<ProductList/>} />}
        {isAuthenticated && <Route path="/admin/product" element={<NewProduct/>} />}
        {isAuthenticated && <Route path="/admin/product/:id" element={<UpdateProduct/>} />}
        {isAuthenticated && <Route path="/admin/orders" element={<OrderList/>} />}
        {isAuthenticated && <Route path="/admin/order/:id" element={<ProcessOrder/>} />}
        {isAuthenticated && <Route path="/admin/users" element={<UsersList/>} />}
        {isAuthenticated && <Route path="/admin/users" element={<UsersList/>} />}
        {isAuthenticated && <Route path="/admin/user/:id" element={<UpdateUser/>} />}
        {isAuthenticated && <Route path="/admin/reviews" element={<ProductReviews/>} />}
        {/* {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            {isAuthenticated && <Route exact path="/process/payment" element={<Payment />} />}
          </Elements>
        )} */}
        

      </Routes>

      <Footer />
    </Router>

  );
}

export default App;
