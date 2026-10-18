# Boutique Shop (PRD v2.0: Minimal Glass-Prism)

Plain HTML, CSS and JavaScript. No build step, no paid services. Every file is separate and editable.

## Files
- `index.html`: page structure (header, hero, catalogue, info, footer, product and cart dialogs)
- `style.css`: palette tokens, layout, hero overlay, glass surfaces (header and cart only)
- `js/config.js`: shop name, tagline, WhatsApp number, hero image path, info blocks, contact, policies
- `js/products.js`: products and variants (price in paise, stock per size + colour)
- `js/cart.js`: cart, stock checks, totals, saved cart
- `js/whatsapp.js`: number check, product-enquiry message, cart-order message
- `js/app.js`: rendering and buttons
- `assets/images/`: put `hero-fashion.jpg` here. `assets/products/`: product photos
- `tests/logic-test.js`: automatic check of cart and WhatsApp logic

## Preview on an Android tablet
1. Copy the whole `boutique-shop` folder to the tablet and open it in your code editor (for example Acode or Spck).
2. Use the editor's "Run" or "Preview in browser" button on `index.html`. Or open the file in Chrome with its file manager ("Open with Chrome").
3. After editing a file, refresh the browser page. If a change does not show, do a hard refresh or clear the site data.
4. Test WhatsApp buttons on a device that has WhatsApp installed.

## Set up the shop
1. `js/config.js`: set `whatsappNumber` (country code plus number, digits only, e.g. `919876543210`), the shop name, tagline, info blocks, contact and policies. Use verified details only.
2. `js/products.js`: edit products. `pricePaise` 79900 means ₹799. Set `active: false` to hide one. Optional `sku` appears in enquiries (the id is used if there is no sku).
3. Add photos to `assets/products/` and match the `image` paths. Add an owner-approved hero photo as `assets/images/hero-fashion.jpg`. Until then, a burgundy palette fallback shows.

## The two WhatsApp actions
- **Ask about this product** (product popup): opens WhatsApp with an editable question about one product, including size/colour only if chosen. It never touches the cart.
- **Order on WhatsApp** (cart): sends all lines, quantities, prices, subtotal and optional details. The seller confirms stock, delivery fee and the order. Nothing is sent until the customer presses Send.
If the number is missing or invalid, both are blocked with a message.

## Stock
A manual snapshot in `products.js`. No live sync. Edit and re-upload when stock changes.

## Hosting
Check a host's current terms first. Do not use GitHub Pages for a shop mainly meant for commercial transactions. Keep a backup of all files.

## Tests
- Automatic: `node tests/logic-test.js` (needs Node on a computer).
- Manual: hero legible on phone and desktop; missing hero and product photos show fallbacks; variants required; quantity 0, -1, 1.5, "abc" rejected; stock limit blocked; cart totals after add, change and remove; both WhatsApp messages open correctly with a real number; no sideways scroll at 320px; keyboard focus visible.
