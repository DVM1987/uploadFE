// hoc/withAuth.tsx
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../app/store';

function withAuth(WrappedComponent) {
  // This function takes a component...
  return props => {
    // ...and returns another component...
    const router = useRouter();
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

    useEffect(() => {
      if (!isLoggedIn) {
        // If the user isn't logged in, redirect them to the login page.
        router.push('/login');
      }
    }, [isLoggedIn, router]);

    // If the user is logged in, render the wrapped component.
    return isLoggedIn ? <WrappedComponent {...props} /> : null;
  };
}

export default withAuth;