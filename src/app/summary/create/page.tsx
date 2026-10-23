'use client';

import BookSummaryCreateSection from '@/components/book/BookSummaryCreateSection/BookSummaryCreateSection';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get('access_token') || '';
    if (!accessToken) router.push('/');
  }, [router]);

  return <BookSummaryCreateSection />;
}
