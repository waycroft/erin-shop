import PrimaryNav from "~/components/PrimaryNav";

export default function Index() {
  return (
    <div className="container mx-auto h-screen flex flex-col">
      <section>
        <PrimaryNav />
      </section>
      <section className="flex flex-col h-full place-content-center">
        <div className="h-fit text-center">
          <h1>Erin Hoffman: Shop</h1>
          <p>(Coming soon)</p>
        </div>
      </section>
    </div>
  );
}
