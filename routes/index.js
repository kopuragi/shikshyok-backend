import { useRoutes } from "react-router-dom";
import Home from "../pages/Home/Home";
import OwnerOrderAllHistory from "../pages/Order/OwnerOrderPage/OwnerOrderAllHistory";
import OwnerOrderHistory from "../pages/Order/OwnerOrderPage/OwnerOrderHistory";
import OnwerOrderHistory2 from "../pages/Order/OwnerOrderPage/OwnerOrderHistory2";
import Menus from "../pages/Menus";
import OwnerMain from "../pages/OwnerMain";
import OwnerReview from "../pages/OwnerReview";
import CounterTest from "../pages/CounterTest";
import OrderTest from "../pages/Order/OwnerOrderPage/OrderTest";
import OrderTest2 from "../pages/Order/OwnerOrderPage/OrderTest2";
import CustomerShopDetail from "../pages/CustomerShopDetail";
import ShoppingCart from "../components/ShoppingCart";
import CusReview from "../pages/CusReview";
import EditProfilePage from "../pages/SignUp/EditProfilePage";
import LoginPage from "../pages/SignUp/LoginPage";
import SignUpPage from "../pages/SignUp/SignUpPage";
import MyPage from "../pages/SignUp/MyPage";
import UserMain from "../pages/UserMain";
//@ts-ignore
import Income from "../pages/Income/Income";
const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/Home", element: <Home /> },
    { path: "/order1", element: <OwnerOrderHistory /> },
    { path: "/order2", element: <OnwerOrderHistory2 /> },
    { path: "/menu", element: <Menus /> },
    { path: "/OwnerOrderHistory", element: <OwnerOrderHistory /> },
    { path: "/", element: <OwnerMain /> },
    { path: "/owner-review", element: <OwnerReview /> },
    { path: "/counter", element: <CounterTest /> },
    { path: "/income", element: <Income /> },
    { path: "/testorder", element: <OrderTest /> },
    { path: "/testorder2", element: <OrderTest2 /> },
    { path: "/shopdetail", element: <CustomerShopDetail /> },
    { path: "/cart", element: <ShoppingCart /> },
    { path: "/review", element: <CusReview /> },
    { path: "/edit-profile", element: <EditProfilePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/mypage", element: <MyPage /> },
    { path: "/UserMain", element: <UserMain /> },
  ]);
  return routes;
};
export default AppRoutes;