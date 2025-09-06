import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_TAGLINE,
  keywords: ['komunitas', 'feedback', 'anonim', 'curhat', 'voting', 'opini'],
  authors: [{ name: 'Pqsaaay Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: APP_NAME,
    description: APP_TAGLINE,
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="https://placehold.co/32x32?text=P" type="image/x-icon" />
        <meta name="theme-color" content="#10B981" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 font-inter antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            {children}
          </div>
          
          {/* Footer */}
          <footer className="border-t border-emerald-100 bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <h3 className="font-poppins text-lg font-semibold text-emerald-800 mb-2">
                  {APP_NAME}
                </h3>
                <p className="text-emerald-600 text-sm mb-4">
                  {APP_TAGLINE}
                </p>
                <div className="flex justify-center space-x-6 text-xs text-emerald-500">
                  <span>Made with 💚</span>
                  <span>•</span>
                  <span>Komunitas yang Peduli</span>
                  <span>•</span>
                  <span>Berbagi dengan Aman</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}