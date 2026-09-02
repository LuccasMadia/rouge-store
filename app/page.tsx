import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Categories } from '@/components/Categories';
import { ProductGrid } from '@/components/ProductGrid';
import { Editorial } from '@/components/Editorial';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';
import { STORE_NAME } from '@/lib/constants';

export default function Home() {
  return (
    <>
      <Header storeName={STORE_NAME} />
      <Hero storeName={STORE_NAME} />
      <Categories />
      <ProductGrid />
      <Editorial />
      <Newsletter />
      <Footer />
    </>
  );
}
