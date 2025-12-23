import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductsDetailes from "../../features/catalog/ProductsDetailes";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import CartPage from "../../features/cart/CartPage";
import Account from "../../features/account/Account";
import Favorite from "../../features/favorite/Favorite";
import Notifications from "../../features/notifications/Notifications";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {path: '/home', element: <HomePage />},
            {path: '/catalog', element: <Catalog />},
            {path: '/catalog/:id', element: <ProductsDetailes />},
            {path: '/about', element: <AboutPage />},
            {path: '/contact', element: <ContactPage />},
            {path: '/cart', element: <CartPage />},
            {path: '/favorites', element: <Favorite />},
            {path: '/account', element: <Account />},
            {path: '/notifications', element: <Notifications />},
            {path: '/server-error', element: <ServerError />},
            {path: '/not-found', element: <NotFound />},
            {path: '*', element: <Navigate replace to='/not-found' />}
        ]
    }
])
