import PrimaryNav from "~/components/PrimaryNav";
import ProductGallery from "~/components/ProductGallery";

export default function Index() {
  return (
    <div className="container mx-auto h-screen flex flex-col">
      <section>
        <PrimaryNav />
      </section>
      <section>
          <ProductGallery />
      </section>
    </div>
  );
}
