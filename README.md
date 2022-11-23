# [collect.erinhoffman.com](https://collect.erinhoffman.com)

Online shop for artist Erin Hoffman.

Built using the amazing [Remix](https://remix.run) and Shopify Storefront API.

Thanks to [Heroicons](https://heroicons.com/), [TailwindCSS](https://tailwindcss.com/), [DaisyUI](daisyui.com/), the [beta React documentation](https://beta.reactjs.org/), and [fly.io](https://fly.io) for making this fun and easy.

# TODO:
- Explicitly show max quantity available in cart, so that user understands why the quantity can't be changed above 1 (or whatever) (high)
- banner showing that we're "not currently taking orders" if store is set to inactive (high)
- See if there's an `inputmode` available for changing item quantity that's not a numpad, but rather a selector (scroll + select) (normal)
- Float cart button bottom right when navbar is scrolled out of view (normal)
- Lighthouse review (normal)
- loading indicators on cart update (normal)
- toast notification "added to cart" on $productHandle page (normal)
- custom gallery sorting (normal)
- catch boundaries (normal)
- testing, both unit + e2e (normal)
- github actions which include tests + fly deploy (normal)
- robots.txt + any other SEO considerations (normal)
- custom thank you email (low)
