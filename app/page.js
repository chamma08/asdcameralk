import {
  getFeaturedProducts,
  getProducts,
} from "@/lib/firestore/products/read_server";
import Header from "./components/Header";
import FeaturedProductSlider from "./components/Sliders";
import { getCollections } from "@/lib/firestore/collections/read_server";
import { getBrands } from "@/lib/firestore/brands/read_server";
import Collections from "./components/Collections";
import Categories from "./components/Categories";
import { getCategories } from "@/lib/firestore/categories/read_server";
import ProductsGridView from "./components/Products";
import CustomerReviews from "./components/CustomerReviews";
import Brands from "./components/Brands";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";
import Services from "./components/Services";
import Redbar from "./components/Redbar";
import ImageSlider from "./components/ImageSlider";
import Banners from "./components/Banners";
import { getImages } from "@/lib/firestore/images/read_server";
import { getBanners } from "@/lib/firestore/banners/read_server";
import { getLogos } from "@/lib/firestore/client-logos/read_server";
import ClientLogoSlider from "./components/ClientLogoSlider";
import NavBar from "./components/NavBar";
import PopupMessage from "./components/PopupMessage";
import ResponsiveMenuBar from "./components/Bar";
import TimeLimitedDemo from "./components/TimeLimitedDemo"; 

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [featuredProducts, collections, categories, products, brands, images, banners, logos] =
    await Promise.all([
      getFeaturedProducts(),
      getCollections(),
      getCategories(),
      getProducts(),
      getBrands(),
      getImages(),
      getBanners(),
      getLogos(),
    ]);

  return (
    <TimeLimitedDemo 
      demoStartDate="2025-06-20" 
      demoLengthDays={14} 
    >
      <main className="w-screen h-screen overflow-x-hidden overflow-y-auto">
        <Redbar />
        <Header />
        <NavBar />
        <ResponsiveMenuBar />
        {/* <SideBar /> */}
        {/* <ImageSlider images={images}/> */}
        <PopupMessage />
        <FeaturedProductSlider featuredProducts={featuredProducts} />
        {/* <Collections collections={collections} /> */}
        <Categories categories={categories} />
        <Services />
        <ClientLogoSlider logos={logos} />
        <ProductsGridView products={products} />
        <Banners banners={banners}/>
        {/* <CustomerReviews /> */}
        <Brands brands={brands} />
        <Footer />
      </main>
    </TimeLimitedDemo>
  );
}