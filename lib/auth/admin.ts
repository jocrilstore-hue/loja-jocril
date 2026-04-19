import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const ALLOWLIST = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

type AdminContext =
  | { isAdmin: true; user: Awaited<ReturnType<typeof currentUser>> & {} }
  | { isAdmin: false; user: Awaited<ReturnType<typeof currentUser>> };

export async function getAdminContext(): Promise<AdminContext> {
  const user = await currentUser();
  if (!user) return { isAdmin: false, user: null };

  const privateRole = (user.privateMetadata as { role?: string } | undefined)?.role;
  const publicRole = (user.publicMetadata as { role?: string } | undefined)?.role;
  const role = privateRole ?? publicRole;

  if (role === 'admin' || role === 'super_admin') {
    return { isAdmin: true, user };
  }

  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (email && ALLOWLIST.includes(email)) {
    return { isAdmin: true, user };
  }

  return { isAdmin: false, user };
}

export async function requireAdmin() {
  const ctx = await getAdminContext();

  if (!ctx.user) {
    redirect('/entrar?redirect_url=/admin');
  }

  if (!ctx.isAdmin) {
    redirect('/');
  }

  return ctx;
}
