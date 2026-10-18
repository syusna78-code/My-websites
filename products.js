// Product data. Prices are in paise (79900 = ₹799). Stock is a manual snapshot:
// edit it by hand when it changes. There is no live inventory in version 1.
// SAMPLE items with sample prices only. Replace all before launch.
const products = [
  { id: "outfit-001", sku: "OUT-001", name: "Everyday Kurti", label: "Bestseller", description: "Soft cotton kurti with a relaxed straight fit. Sample listing.",
    pricePaise: 79900, image: "outfit-001.svg", active: true,
    variants: [
      { size: "S", colour: "Beige", stock: 3 },
      { size: "M", colour: "Beige", stock: 2 },
      { size: "S", colour: "Burgundy", stock: 0 },
      { size: "M", colour: "Burgundy", stock: 1 }
    ] },
  { id: "outfit-002", sku: "OUT-002", name: "Linen Co-ord Set", label: "", description: "Breathable linen top and trouser set. Sample listing.",
    pricePaise: 149900, image: "outfit-002.svg", active: true,
    variants: [
      { size: "M", colour: "Mocha", stock: 4 },
      { size: "L", colour: "Mocha", stock: 2 },
      { size: "M", colour: "Burgundy", stock: 3 }
    ] },
  { id: "outfit-003", sku: "OUT-003", name: "Printed Dupatta", label: "", description: "Lightweight printed dupatta. Sample listing.",
    pricePaise: 39900, image: "outfit-003.svg", active: true,
    variants: [
      { size: "Free size", colour: "Beige", stock: 6 },
      { size: "Free size", colour: "Burgundy", stock: 0 }
    ] },
  { id: "outfit-004", sku: "OUT-004", name: "Hidden Item", label: "", description: "Inactive products are not shown.",
    pricePaise: 10000, image: "outfit-004.svg", active: false,
    variants: [

    ] },
  { id: "outfit-005", sku: "OUT-005", name: "Anarkali Festive Gown", label: "New", description: "Flowing floor-length gown with fine trim. Sample listing.",
    pricePaise: 249900, image: "outfit-005.svg", active: true,
    variants: [
      { size: "S", colour: "Burgundy", stock: 2 },
      { size: "M", colour: "Burgundy", stock: 3 },
      { size: "L", colour: "Burgundy", stock: 1 }
    ] },
  { id: "outfit-006", sku: "OUT-006", name: "Straight-Fit Palazzo", label: "", description: "Wide-leg palazzo with elastic waist. Sample listing.",
    pricePaise: 69900, image: "outfit-006.svg", active: true,
    variants: [
      { size: "M", colour: "Mocha", stock: 5 },
      { size: "L", colour: "Mocha", stock: 4 },
      { size: "XL", colour: "Mocha", stock: 2 }
    ] },
  { id: "outfit-007", sku: "OUT-007", name: "Cotton Maxi Dress", label: "", description: "Easy everyday maxi in soft cotton. Sample listing.",
    pricePaise: 119900, image: "outfit-007.svg", active: true,
    variants: [
      { size: "S", colour: "Espresso", stock: 2 },
      { size: "M", colour: "Espresso", stock: 2 },
      { size: "L", colour: "Espresso", stock: 0 }
    ] },
  { id: "outfit-008", sku: "OUT-008", name: "Embroidered Short Kurti", label: "Limited", description: "Short kurti with neckline embroidery. Sample listing.",
    pricePaise: 94900, image: "outfit-008.svg", active: true,
    variants: [
      { size: "S", colour: "Beige", stock: 1 },
      { size: "M", colour: "Beige", stock: 2 },
      { size: "L", colour: "Beige", stock: 2 }
    ] },
  { id: "outfit-009", sku: "OUT-009", name: "Silk-Blend Scarf", label: "", description: "Smooth silk-blend scarf. Sample listing.",
    pricePaise: 54900, image: "outfit-009.svg", active: true,
    variants: [
      { size: "Free size", colour: "Burgundy", stock: 8 },
      { size: "Free size", colour: "Mocha", stock: 5 }
    ] },
  { id: "outfit-010", sku: "OUT-010", name: "Ribbed Knit Top", label: "", description: "Fitted ribbed top, stretchy and soft. Sample listing.",
    pricePaise: 59900, image: "outfit-010.svg", active: true,
    variants: [
      { size: "S", colour: "Beige", stock: 3 },
      { size: "M", colour: "Beige", stock: 3 },
      { size: "M", colour: "Espresso", stock: 2 }
    ] }
];
