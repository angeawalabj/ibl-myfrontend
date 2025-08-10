import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes qui ne nécessitent pas d'authentification
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/password-reset',
  '/activation',
  '/2fa',  // accès libre à la page 2fa
  '/api/', // API publique (adapter selon besoin)
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Si chemin public, on laisse passer
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Ici vérifier présence token JWT dans cookie (exemple)
  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    // Rediriger vers login avec query param pour retour après connexion
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // TODO: Optionnel : vérifier si 2FA est nécessaire et non validée, rediriger vers /2fa

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], // appliquer à toutes les routes sauf les assets
};
