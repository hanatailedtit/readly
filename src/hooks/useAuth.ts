import { jwtVerify } from 'jose';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const accessToken = Cookies.get('access_token') || '';

  useEffect(() => {
    const secretKey = new TextEncoder().encode(
      process.env.NEXT_PUBLIC_JWT_SECRET_KEY,
    );
    jwtVerify(accessToken, secretKey)
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, [accessToken]);

  return { isLoggedIn };
};
