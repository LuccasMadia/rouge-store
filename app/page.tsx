import { Header } from '@/components/Header';
import { Manifesto } from '@/components/Manifesto';
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
      <Manifesto storeName={STORE_NAME} />
      <Categories />
      <ProductGrid />
      <Editorial />
      <Newsletter />
      <Footer />
    </>
  );
}
