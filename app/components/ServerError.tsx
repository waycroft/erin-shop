import { Link } from "@remix-run/react";

export default function ServerError() {
  return (
    <main className="container mx-auto my-48 w-fit">
      <div className="mb-4">
        <h1>Store unavailable.</h1>
        <p>collect.erinhoffman.com is currently unavailable.</p>
        <p>In the meantime, checkout Erin's artist website: <a href="https://erinphoffman.com">erinphoffman.com</a></p>
      </div>
      <div>
        <Link to="/" className="underline">Head back home</Link>
      </div>
    </main>
  )
}