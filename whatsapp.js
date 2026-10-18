// WhatsApp message + click-to-chat link.
const WhatsApp = (() => {
  const MAX_URL = 2000;
  const inr = paise => "₹" + (paise / 100).toLocaleString("en-IN",
    { minimumFractionDigits: paise % 100 ? 2 : 0, maximumFractionDigits: 2 });
  const numberOk = () => /^[1-9]\d{7,14}$/.test(shopConfig.whatsappNumber);

  function message(cart, d, withExtras) {
    const t = [`Hello ${shopConfig.shopName}, I would like to order:`, ""];
    cart.lines.forEach((l, i) => {
      t.push(`${i + 1}. ${l.product.name}`, `   Size: ${l.size} | Colour: ${l.colour}`,
        `   ${l.qty} x ${inr(l.unitPaise)} = ${inr(l.linePaise)}`);
    });
    t.push("", `Subtotal: ${inr(cart.subtotalPaise)}`, "Delivery: to be confirmed by seller");
    if (withExtras) t.push("Final availability and order acceptance to be confirmed by seller.");
    if (d.name) t.push("", `Name: ${d.name}`);
    if (d.phone) t.push(`Phone: ${d.phone}`);
    if (d.address && withExtras) t.push(`Address: ${d.address}`);
    return t.join("\n");
  }
  // Returns {url} or {error}. Never drops product lines.
  function build(cart, details) {
    if (!numberOk()) return { error: "WhatsApp number is not set up. The shop owner must add it in js/config.js." };
    for (const extras of [true, false]) {
      const url = `https://wa.me/${shopConfig.whatsappNumber}?text=${encodeURIComponent(message(cart, details, extras))}`;
      if (url.length <= MAX_URL) return { url, trimmed: !extras };
    }
    return { error: "Your order is too long for one WhatsApp message. Remove some items or send it in two orders." };
  }
  // Product enquiry: independent of the cart. Selected variant is included only if chosen.
  function enquiry(p, size, colour) {
    if (!numberOk()) return { error: "WhatsApp number is not set up. The shop owner must add it in js/config.js." };
    const picked = [size && "Size " + size, colour && "Colour " + colour].filter(Boolean).join(", ");
    const text = `Hi! I'm interested in ${p.name} (${p.sku || p.id}). Price shown: ${inr(p.pricePaise)}. ` +
      (picked ? `Selected: ${picked}. ` : "") + "Could you share more details about availability, fabric/measurements and delivery?";
    return { url: `https://wa.me/${shopConfig.whatsappNumber}?text=${encodeURIComponent(text)}`, text };
  }
  return { inr, build, enquiry, numberOk };
})();
