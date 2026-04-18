# lib/adapters

Maps **DB shape** (`product_templates` + `product_variants`, English snake_case) to the
**UI shape** defined in `lib/types.ts` (flat PT objects like `Product { preco, stock: enum }`).

## Why

The UI was built from the Claude Design prototype before the DB existed. The DB was built before the new UI. They don't match. Rather than rewrite either, every DB boundary goes through an adapter.

## Pattern

```ts
// Read: DB → UI
export function toUIProduct(row: DBTemplate): Product { ... }

// Write: UI → DB
export function fromUIProduct(p: Product): DBTemplate { ... }
```

Queries end with `.map(toUIProduct)`. API route handlers call `fromUIProduct` before insert/update.

## Files (added as milestones land)

- `product-adapter.ts` — B1
- `order-adapter.ts` — B4
- `customer-adapter.ts` — B5
- `variant-adapter.ts` — B6

Keep each adapter under ~120 lines. If it grows beyond that, split by read/write.
