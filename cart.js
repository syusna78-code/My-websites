// Cart logic. Only {productId,size,colour,qty} is stored; prices and stock are
// always recalculated from products.js, never trusted from storage.
const Cart = (() => {
  const KEY = "boutique-cart-v1";
  let lines = [];
  const find = id => products.find(p => p.id === id && p.active);
  const variantOf = (p, size, colour) => p.variants.find(v => v.size === size && v.colour === colour);
  const validQty = n => Number.isInteger(n) && n > 0;

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      lines = Array.isArray(raw) ? raw.filter(l => l && typeof l.productId === "string" &&
        typeof l.size === "string" && typeof l.colour === "string" && validQty(l.qty)) : [];
    } catch (e) { lines = []; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch (e) {} }

  // Merge rule: same product + size + colour = one line, quantities added, then stock-checked.
  function add(productId, size, colour, qty) {
    const p = find(productId), v = p && variantOf(p, size, colour);
    if (!v) return { ok: false, error: "That size and colour is not available." };
    if (!validQty(qty)) return { ok: false, error: "Enter a whole number of 1 or more." };
    const existing = lines.find(l => l.productId === productId && l.size === size && l.colour === colour);
    const total = qty + (existing ? existing.qty : 0);
    if (total > v.stock) return { ok: false, error: v.stock === 0 ? "Out of stock." :
      "Only " + v.stock + " in stock" + (existing ? " (" + existing.qty + " already in your cart)." : ".") };
    if (existing) existing.qty = total; else lines.push({ productId, size, colour, qty });
    save(); return { ok: true };
  }
  function setQty(i, qty) {
    const r = resolve().lines.find(x => x.index === i);
    if (!r || !validQty(qty) || qty > r.stock) return false;
    lines[i].qty = qty; save(); return true;
  }
  function remove(i) { lines.splice(i, 1); save(); }
  function clear() { lines = []; save(); }

  // Rebuild lines from current data; drop dead lines, clamp quantities to stock.
  function resolve() {
    const out = [], notices = []; let changed = false;
    const kept = [];
    lines.forEach(l => {
      const p = find(l.productId), v = p && variantOf(p, l.size, l.colour);
      if (!v || v.stock < 1) { notices.push((p ? p.name : "An item") + " is no longer available and was removed."); changed = true; return; }
      if (l.qty > v.stock) { l.qty = v.stock; notices.push(p.name + " quantity reduced to " + v.stock + " (stock limit)."); changed = true; }
      kept.push(l);
    });
    if (changed) { lines = kept; save(); }
    lines.forEach((l, index) => {
      const p = find(l.productId), v = variantOf(p, l.size, l.colour);
      out.push({ index, product: p, size: l.size, colour: l.colour, qty: l.qty, stock: v.stock,
        unitPaise: p.pricePaise, linePaise: p.pricePaise * l.qty });
    });
    return { lines: out, notices, subtotalPaise: out.reduce((s, l) => s + l.linePaise, 0),
      count: out.reduce((s, l) => s + l.qty, 0) };
  }
  load();
  return { add, setQty, remove, clear, resolve, variantOf, validQty };
})();
