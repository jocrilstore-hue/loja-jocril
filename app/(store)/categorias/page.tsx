import Badge from '@/components/store/Badge';
import FooterCTA from '@/components/store/FooterCTA';
import CategoryGridCard from '@/components/store/CategoryGridCard';
import { listCategoriesWithCounts, type UICategory } from '@/lib/queries/products';
import {
  getCategoryMeta,
  GROUP_ORDER,
  DEFAULT_GROUP,
  DEFAULT_IMG,
} from '@/lib/data/category-groups';

export const revalidate = 300;

type Group = {
  group: string;
  items: Array<{
    slug: string;
    n: string;
    name: string;
    count: number;
    img: string;
    desc?: string;
  }>;
};

function buildGroups(cats: UICategory[]): Group[] {
  const buckets = new Map<string, Group["items"]>();
  let ordinal = 0;

  for (const c of cats) {
    ordinal += 1;
    const meta = getCategoryMeta(c.slug);
    const groupKey = meta.group;
    if (!buckets.has(groupKey)) buckets.set(groupKey, []);
    buckets.get(groupKey)!.push({
      slug: c.slug,
      n: String(ordinal).padStart(2, '0'),
      name: c.name,
      count: c.productCount ?? 0,
      img: meta.img ?? DEFAULT_IMG,
      desc: meta.desc ?? c.description ?? undefined,
    });
  }

  const ordered: Group[] = [];
  for (const g of GROUP_ORDER) {
    const items = buckets.get(g);
    if (items && items.length > 0) ordered.push({ group: g, items });
    buckets.delete(g);
  }
  // Any unexpected groups fall through at the end.
  for (const [g, items] of buckets) {
    if (items.length > 0) ordered.push({ group: g, items });
  }
  return ordered;
}

export default async function CategoriasPage() {
  const cats = await listCategoriesWithCounts();
  const groups = buildGroups(cats);
  const total = cats.reduce((s, c) => s + (c.productCount ?? 0), 0);

  return (
    <>
      <main id="main">
        <section data-screen-label="01 Categorias hero" style={{ padding: '64px 40px 40px', borderBottom: '1px dashed var(--color-base-800)', background: 'var(--color-dark-base-primary)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 60, alignItems: 'end' }}>
            <div>
              <Badge size="sm">Catálogo · {total.toString().padStart(3, '0')} referências</Badge>
              <h1 className="heading-1" style={{ margin: '20px 0 0', color: 'var(--color-light-base-primary)' }}>
                Todas as <span style={{ color: 'var(--color-accent-100)' }}>categorias</span>.
              </h1>
            </div>
            <p className="text-body" style={{ color: 'var(--color-base-300)', maxWidth: '44ch' }}>
              Produtos desenhados e produzidos na nossa fábrica em Massamá. Corte laser, termoformação a vácuo e impressão UV integrados.
            </p>
          </div>
        </section>

        {groups.map((g, gi) => (
          <section key={g.group} data-screen-label={`0${gi + 2} ${g.group}`} style={{ padding: '64px 40px', borderBottom: gi < groups.length - 1 ? '1px solid var(--color-base-900)' : 'none', background: 'var(--color-dark-base-primary)' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 28 }}>
                <span className="text-mono-xs" style={{ color: 'var(--color-base-600)' }}>
                  {String(gi + 1).padStart(2, '0')} · {g.items.reduce((s, i) => s + i.count, 0)} produtos
                </span>
                <h2 className="heading-2" style={{ margin: 0, color: 'var(--color-light-base-primary)' }}>{g.group}</h2>
                <div style={{ flex: 1, borderBottom: '1px dashed var(--color-base-800)', alignSelf: 'center' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {g.items.map((c) => (
                  <CategoryGridCard
                    key={c.slug}
                    n={c.n}
                    name={c.name}
                    count={c.count}
                    img={c.img}
                    desc={c.desc}
                    href={`/produtos?cat=${c.slug}`}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
      <FooterCTA />
    </>
  );
}
