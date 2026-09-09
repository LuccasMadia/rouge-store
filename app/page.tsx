import { Header } from '@/components/Header';
import { Manifesto } from '@/components/Manifesto';
import { Categories } from '@/components/Categories';
import { CollectionSection } from '@/components/CollectionSection';
import { Editorial } from '@/components/Editorial';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';
import { STORE_NAME } from '@/lib/constants';
import { COLLECTIONS } from '@/lib/collections';

export default function Home() {
  return (
    <>
      <Header storeName={STORE_NAME} />
      <Manifesto storeName={STORE_NAME} />
      <Categories />
      <div id="produtos">
        {COLLECTIONS.map((collection) => (
          <CollectionSection key={collection.slug} collection={collection} />
        ))}
      </div>
      <Editorial />
      <Newsletter />
      <Footer />
    </>
  );
}
