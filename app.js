// Rendering and events.
(() => {
  const $ = id => document.getElementById(id);
  const PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect width="300" height="400" fill="#E6D5C1"/><text x="150" y="205" text-anchor="middle" font-family="Georgia" font-size="18" fill="#6B4E3D">Photo coming soon</text></svg>');
  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
  function pic(src, alt) {
    const i = el("img"); i.alt = alt; i.loading = "lazy";
    i.addEventListener("error", () => { i.src = PLACEHOLDER; }, { once: true });
    i.src = src || PLACEHOLDER; return i;
  }
  const stockOf = p => p.variants.reduce((s, v) => s + v.stock, 0);
  const uniq = (p, k) => [...new Set(p.variants.map(v => v[k]))];

  // ----- setup -----
  document.title = shopConfig.shopName;
  $("brand").textContent = shopConfig.shopName;
  $("tagline").textContent = shopConfig.tagline;
  $("f-contact").textContent = shopConfig.contact;
  $("f-policies").textContent = shopConfig.policies;
  (shopConfig.info || []).forEach(i => { const d = el("div"); d.append(el("h3", "", i.title), el("p", "", i.text)); $("info-list").append(d); });
  if (shopConfig.heroImage) { // use the photo only if it loads; otherwise the CSS palette fallback stays
    const t = new Image(); t.onload = () => $("hero").style.setProperty("--hero-img", 'url("' + shopConfig.heroImage + '")'); t.src = shopConfig.heroImage;
  }

  // ----- catalogue -----
  function renderGrid() {
    const grid = $("grid"); grid.textContent = "";
    const active = products.filter(p => p.active);
    $("no-products").hidden = active.length > 0;
    active.forEach(p => {
      const b = el("button", "card" + (stockOf(p) ? "" : " soldout")); b.type = "button";
      b.append(pic(p.image, p.name + " photo"), el("h3", "", p.name),
        el("p", "price", WhatsApp.inr(p.pricePaise)));
      if (p.label) b.append(el("p", "tag", p.label));
      b.append(el("p", "tag", stockOf(p) ? "In stock" : "Out of stock"));
      b.addEventListener("click", () => openProduct(p));
      grid.append(b);
    });
  }

  // ----- product dialog -----
  let sel = { p: null, size: "", colour: "" };
  function openProduct(p) {
    sel = { p, size: "", colour: "" };
    const im = $("pd-img"); im.alt = p.name + " photo"; im.addEventListener("error", () => { im.src = PLACEHOLDER; }, { once: true });
    im.src = p.image || PLACEHOLDER;
    $("pd-title").textContent = p.name; $("pd-price").textContent = WhatsApp.inr(p.pricePaise);
    $("pd-desc").textContent = p.description; $("pd-qty").value = "1"; $("pd-error").textContent = "";
    renderOptions(); $("product-dialog").showModal();
  }
  function renderOptions() {
    const { p, size, colour } = sel;
    const ok = (s, c) => p.variants.some(v => (!s || v.size === s) && (!c || v.colour === c) && v.stock > 0);
    [["pd-sizes", "size", uniq(p, "size")], ["pd-colours", "colour", uniq(p, "colour")]].forEach(([box, key, vals]) => {
      const c = $(box); c.textContent = "";
      vals.forEach(val => {
        const avail = key === "size" ? ok(val, colour) : ok(size, val);
        const b = el("button", "opt", val + (avail ? "" : " (unavailable)")); b.type = "button";
        b.disabled = !avail; b.setAttribute("aria-pressed", String(sel[key] === val));
        b.addEventListener("click", () => { sel[key] = sel[key] === val ? "" : val; $("pd-error").textContent = ""; renderOptions(); });
        c.append(b);
      });
    });
    const v = size && colour ? Cart.variantOf(p, size, colour) : null;
    $("pd-stock").textContent = v ? (v.stock > 0 ? "In stock: " + v.stock + " available" : "Out of stock") : "Select a size and colour to see stock.";
  }
  $("pd-add").addEventListener("click", () => {
    const err = $("pd-error"), { p, size, colour } = sel;
    if (!size || !colour) { err.textContent = "Select a size and a colour first."; return; }
    const raw = $("pd-qty").value.trim();
    if (!/^[1-9]\d*$/.test(raw)) { err.textContent = "Quantity must be a whole number, 1 or more."; return; }
    const r = Cart.add(p.id, size, colour, Number(raw));
    if (!r.ok) { err.textContent = r.error; return; }
    $("product-dialog").close(); updateCount(); openCart();
  });

  $("pd-enquire").addEventListener("click", () => {
    const r = WhatsApp.enquiry(sel.p, sel.size, sel.colour);
    if (r.error) { $("pd-error").textContent = r.error; return; }
    $("pd-error").textContent = ""; window.open(r.url, "_blank", "noopener");
  });

  // ----- cart dialog -----
  function updateCount() { $("cart-count").textContent = Cart.resolve().count; }
  function openCart() { renderCart(); $("cart-dialog").showModal(); }
  function renderCart(extraNotice) {
    const c = Cart.resolve(), box = $("cart-lines"); box.textContent = "";
    $("cart-notice").textContent = [extraNotice, ...c.notices].filter(Boolean).join(" ");
    $("cart-empty").hidden = c.lines.length > 0; $("cart-summary").hidden = c.lines.length === 0;
    c.lines.forEach(l => {
      const row = el("div", "line"), info = el("div");
      info.append(el("h3", "", l.product.name), el("p", "hint", `Size ${l.size}, ${l.colour}`),
        el("p", "", `${WhatsApp.inr(l.unitPaise)} each, line total ${WhatsApp.inr(l.linePaise)}`));
      const q = el("div", "qty"), minus = el("button", "btn btn-ghost", "−"), plus = el("button", "btn btn-ghost", "+"), rm = el("button", "btn btn-ghost", "Remove");
      [minus, plus, rm].forEach(b => b.type = "button");
      minus.setAttribute("aria-label", "Decrease quantity"); plus.setAttribute("aria-label", "Increase quantity");
      rm.setAttribute("aria-label", "Remove " + l.product.name);
      minus.disabled = l.qty <= 1; plus.disabled = l.qty >= l.stock;
      minus.addEventListener("click", () => { Cart.setQty(l.index, l.qty - 1); renderCart(); updateCount(); });
      plus.addEventListener("click", () => { Cart.setQty(l.index, l.qty + 1); renderCart(); updateCount(); });
      rm.addEventListener("click", () => { Cart.remove(l.index); renderCart(); updateCount(); });
      q.append(minus, el("span", "", String(l.qty)), plus, rm);
      if (l.qty >= l.stock) q.append(el("span", "hint", "Stock limit reached"));
      info.append(q); row.append(pic(l.product.image, l.product.name + " photo"), info); box.append(row);
    });
    $("subtotal").textContent = WhatsApp.inr(c.subtotalPaise);
    $("order-btn").disabled = !WhatsApp.numberOk();
    $("wa-error").textContent = WhatsApp.numberOk() ? "" : "WhatsApp number is not set up. The shop owner must add it in js/config.js.";
  }

  function validate() {
    const d = { name: $("c-name").value.trim(), phone: $("c-phone").value.trim(), address: $("c-address").value.trim() };
    const e = { name: d.name.length > 60 ? "Name must be 60 characters or fewer." : "",
      phone: d.phone && !/^\+?[0-9 ()-]{7,20}$/.test(d.phone) ? "Enter a valid phone number, e.g. +91 98765 43210." : "",
      address: d.address.length > 300 ? "Address must be 300 characters or fewer." : "" };
    Object.keys(e).forEach(k => { $("e-" + k).textContent = e[k]; $("c-" + k).setAttribute("aria-invalid", String(!!e[k])); });
    return Object.values(e).some(Boolean) ? null : d;
  }
  $("order-btn").addEventListener("click", () => {
    const d = validate(); if (!d) return;
    const c = Cart.resolve(); if (!c.lines.length) return;
    const r = WhatsApp.build(c, d);
    if (r.error) { $("wa-error").textContent = r.error; return; }
    $("wa-error").textContent = r.trimmed ? "Message was shortened (address and note left out). Tell the shop your address in WhatsApp." : "";
    window.open(r.url, "_blank", "noopener");
  });
  $("clear-cart").addEventListener("click", () => { Cart.clear(); renderCart(); updateCount(); });
  $("open-cart").addEventListener("click", openCart);
  document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => b.closest("dialog").close()));
  document.querySelectorAll("dialog").forEach(d => d.addEventListener("click", e => { if (e.target === d) d.close(); }));
  $("cart-dialog").addEventListener("close", updateCount);

  renderGrid(); updateCount();
})();
