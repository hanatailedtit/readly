import DefaultHeader from '@/components/header/DefaultHeader';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Provider from './provider';
import KaKaoScript from './script/KaKaoScript';
import CommonToaster from '@/components/ui/toast/CommonToaster/CommonToaster';
import { Suspense } from 'react';

const ibmPlexSansKR = localFont({
  src: [
    {
      path: '../../public/fonts/IBMPlexSansKR-Regular.ttf',
      weight: '400',
    },
    {
      path: '../../public/fonts/IBMPlexSansKR-Bold.ttf',
      weight: '700',
    },
  ],
  variable: '--font-ibm-plex-sans',
});

export const metadata: Metadata = {
  title: 'Readly',
  description: 'Readly에서 읽은 책의 한마디를 작성해보세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSansKR.className} antialiased overflow-x-hidden`}
      >
        <Provider>
          <div className="flex flex-col items-center">
            <DefaultHeader />
            <div className="w-full m-[24px] lg:w-[1000px] px-[16px] md:px-[32px]">
              <Suspense>{children}</Suspense>
            </div>
          </div>
        </Provider>
        <CommonToaster />
      </body>
      <KaKaoScript />
    </html>
  );
}
