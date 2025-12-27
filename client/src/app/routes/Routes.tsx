import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductsDetailes from "../../features/catalog/ProductsDetailes";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import CartPage from "../../features/cart/CartPage";
import Favorite from "../../features/favorite/Favorite";
import Notifications from "../../features/notifications/NotificationsPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import Checkout from "../../features/checkout/Checkout";
import CategoryPage from "../../features/catalog/CategoryPage";
import SmokePage from "../../features/home/SmokePage";
import LoginPage from "../../features/account/LoginPage";
import AccountPage from "../../features/account/AccountPage";
import Register from "../../features/account/Register";
import RequirAuth from "./RequireAuth";
import LandingPage from "../../landing/LandingPage";
export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {element: <RequirAuth />, children: [
                {path: '/home', element: <HomePage />},
                {path: '/smoke', element: <SmokePage />},
                {path: '/catalog', element: <Catalog />},
                {path: '/products/:slug', element: <CategoryPage />},
                {path: '/catalog/:id', element: <ProductsDetailes />},
                {path: '/about', element: <AboutPage />},
                {path: '/contact', element: <ContactPage />},
                {path: '/cart', element: <CartPage />},
                {path: '/checkout', element: <Checkout />},
                {path: '/favorites', element: <Favorite />},
                {path: '/account', element: <AccountPage />},
                {path: '/notifications', element: <Notifications />}
        ]},
        {path: '/sign-in', element: <LoginPage />},
        {path: '/sign-up', element: <Register />},
        {path: '/server-error', element: <ServerError />},
        {path: '/not-found', element: <NotFound />},
        {path: '/', element: <LandingPage />},
        {path: '*', element: <Navigate replace to='/not-found' />}
        ]
    }
])
