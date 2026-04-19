# Handoff: Header/Footer Contact Polish — 2026-04-19

## Current State

Header, footer, contact details, and testing email copies were updated on `codex/finish-launch-gaps`. `bun run build` passed cleanly after the final changes, and static built output was checked for the new contact/menu/payment strings plus removal of stale visible labels.

## Key Decisions

- Categories now live under the main `Categorias` nav item instead of a separate desktop category bar, keeping the header to one primary navigation row.
- The header includes `Início` as the explicit home link and removes visible `Loja Online` wording from the UI/title surfaces.
- During testing, customer order confirmation and payment confirmation emails BCC admin recipients using `ADMIN_EMAILS`, falling back to `ADMIN_EMAIL`, then `jocrilstore@gmail.com`.
- Customer-facing contact/location copy now uses Massamá, `geral@jocril.pt`, and `(+351) 21 471 89 03`.

## Don't Break

- `bun run build` must remain clean.
- Header category links must continue filtering `/produtos?cat=...`; `/categorias` itself remains reachable from the top-level `Categorias` link.
- Customer-facing order/payment emails must still go to the customer while also copying admins during testing.
- Footer payment methods should remain on one horizontal row.

## Next Step

After the GitHub push, check the deployed/preview site visually for the header submenu and footer payment row at desktop and mobile widths.

## Resume Command

Run `bun run build`, then inspect `/`, `/contacto`, and `/produtos` in the deployed preview.
