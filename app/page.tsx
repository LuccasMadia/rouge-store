import { Header } from '@/components/Header';
import { Manifesto } from '@/components/Manifesto';
import { Categories } from '@/components/Categories';
import { CategorySection } from '@/components/CategorySection';
import { Editorial } from '@/components/Editorial';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';
import { STORE_NAME } from '@/lib/constants';
import { CATEGORIES } from '@/lib/categories';

export default function Home() {
  return (
    <>
      <Header storeName={STORE_NAME} />
      <Manifesto storeName={STORE_NAME} />
      <Categories />
      <div id="produtos">
        {CATEGORIES.map((category) => (
          <CategorySection key={category.slug} category={category} />
        ))}
      </div>
      <Editorial />
      <Newsletter />
      <Footer />
    </>
  );
}
