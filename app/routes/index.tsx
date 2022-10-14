import PrimaryNav from "~/components/PrimaryNav";
import ProductGallery from "~/components/ProductGallery";

export default function Index() {
  return (
    <div>
      <section>
        <PrimaryNav />
      </section>
      <section>
          <ProductGallery />
      </section>
    </div>
  );
}
