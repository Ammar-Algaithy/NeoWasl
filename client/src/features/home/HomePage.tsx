import { useEffect } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBusinessType } from "../catalog/catalogSlice";
import CategoriesSection from "./componenets/CategoriesSecion";
import PromoBanner from "./componenets/PromoBanner";
import type { RootState } from "../../app/store/store";
import BusinessTypeSwitcher, { type BusinessType } from "./componenets/BusinessTypeSwitcher";
import FeaturedProducts from "./componenets/FeaturedProducts";
import TopNavBar from "../../app/layout/TopNavBar";
import BottomNav from "../../app/layout/BottomNav";

const groceryCategories = [
  {
    name: "Beverages",
    slug: "Beverages",
    image: "https://neowaslstorage.blob.core.windows.net/images/categories/bev.jpg",
  },
  {
    name: "Candy",
    slug: "Candy",
    image: "https://neowaslstorage.blob.core.windows.net/images/categories/candies.png",
  },
  {
    name: "Snacks & Cookies",
    slug: "Snacks%20%26%20Cookies",
    image: "https://neowaslstorage.blob.core.windows.net/images/categories/snacksandcookies.png",
  },
  {
    name: "Cakes",
    slug: "Cakes",
    image: "https://neowaslstorage.blob.core.windows.net/images/categories/cakes.jpg",
  },
  {
    name: "Gums",
    slug: "Gum",
    image: "https://neowaslstorage.blob.core.windows.net/images/categories/GUMS.jpg",
  },
  {
    name: "Meds",
    slug: "MED",
    image: "https://neowaslstorage.blob.core.windows.net/images/categories/MEDS.jpg",
  },
  {
    name: "Essentials",
    slug: "Essentials",
    image: "https://neowaslstorage.blob.core.windows.net/images/categories/essentials.png",
  },
  {
    name: "All",
    slug: "All",
    image: "https://neowaslstorage.blob.core.windows.net/images/categories/all.png",
  },
];


export default function HomePage() {
  const HEADER_H = 64;
  const BOTTOM_NAV_H = 78;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { businessType } = useSelector((state: RootState) => state.catalog);

  useEffect(() => {
     if (businessType === 'Smoke Gear') {
         dispatch(setBusinessType('Grocery')); 
     }
     // ... Scroll Lock Logic (omitted for brevity) ...
     const html = document.documentElement;
     const body = document.body;
     html.style.overflow = "hidden";
     body.style.overflow = "hidden";
     body.style.height = "100%";
     return () => {
       html.style.overflow = "";
       body.style.overflow = "";
       body.style.height = "";
     };
  }, [dispatch, businessType]);

  const activeType: BusinessType = "Grocery";

  useEffect(() => {
    dispatch(setBusinessType(activeType));
  }, [dispatch]);

  const handleSelect = (type: BusinessType) => {
    dispatch(setBusinessType(type));
  };

  return (
    <>
    <TopNavBar />
    <div style={{ position: "fixed", inset: 0, background: "#f3f4f6", overflow: "hidden", touchAction: "none" }}>
      <div style={{
          position: "absolute", top: HEADER_H, left: 0, right: 0, bottom: BOTTOM_NAV_H,
          overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch",
          padding: "16px 16px 20px 16px", touchAction: "pan-y",
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          
          {/* 👇 Replaced verbose button mapping with Component */}
          <BusinessTypeSwitcher
            activeType={activeType}
            variant="light"
            onSelect={handleSelect}
            navigateTo={navigate} // ✅ now Grocery will go to "/home"
          />

          <Box><PromoBanner /></Box>
          <Box><CategoriesSection categories={groceryCategories} /></Box>
          <Box><FeaturedProducts /></Box>

        </div>
      </div>
    </div>
    <BottomNav children={undefined} />
    </>
  );
}