import { Link } from "@remix-run/react";

export default function ServerError() {
  return (
    <main className="container mx-auto my-48 w-fit">
      <div className="mb-4">
        <h1>Oops!</h1>
        <h2>Something went wrong.</h2>
      </div>
      <div>
        <Link to="/" className="underline">Head back home</Link>
      </div>
    </main>
  )
}