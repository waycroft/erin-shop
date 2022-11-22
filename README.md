# [collect.erinhoffman.com](https://collect.erinhoffman.com)

Online shop for artist Erin Hoffman.

Built using the amazing [Remix](https://remix.run) and Shopify Storefront API.

Thanks to [Heroicons](https://heroicons.com/), [TailwindCSS](https://tailwindcss.com/), [DaisyUI](daisyui.com/), the [beta React documentation](https://beta.reactjs.org/), and [fly.io](https://fly.io) for making this fun and easy.

# TODO:
- show on index page (gallery) if an item is sold out (high)
- The "__session" cookie is not signed, but session cookies should be signed to prevent tampering on the client before they are sent back to the server. See https://remix.run/api/remix#signing-cookies for more information. (high)
- Item title prints on index gallery on hover, or beneath image on mobile (normal)
- Lighthouse review (normal)
- banner showing that we're "not currently taking orders" if store is set to inactive (normal)
- loading indicators on cart update (normal)
- toast notification "added to cart" on $productHandle page (normal)
- custom gallery sorting (normal)
- catch boundaries (normal)
- testing, both unit + e2e (normal)
- github actions which include tests + fly deploy (normal)
- robots.txt + any other SEO considerations (normal)
- custom email receipts (low)
