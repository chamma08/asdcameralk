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

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [featuredProducts, collections, categories, products, brands] =
    await Promise.all([
      getFeaturedProducts(),
      getCollections(),
      getCategories(),
      getProducts(),
      getBrands(),
    ]);
  return (
    <main className="w-screen h-screen overflow-x-hidden overflow-y-auto">
      <Header />
      {/* <SideBar /> */}
      <FeaturedProductSlider featuredProducts={featuredProducts} />
      <Collections collections={collections} />
      <Services />
      <Categories categories={categories} />
      <ProductsGridView products={products} />
      <CustomerReviews />
      <Brands brands={brands} />
      <Footer />
    </main>
  );
}
