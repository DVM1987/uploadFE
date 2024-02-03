import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../app/store';
import type { AppProps } from 'next/app';
import { loginFulfilled } from '../features/login/loginSlice';
import Cookies from 'js-cookie';
import Login from './login';
import Upload from './upload';

const CheckToken = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(Cookies.get('user') || '{}');
    const token = Cookies.get('token');
    if (token && user) {
      // If there's a token and a user in the cookies, dispatch the loginFulfilled action
      dispatch(loginFulfilled({ user, token })); // Call loginFulfilled with the user and the token
    }
  }, [dispatch]);

  return children;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CheckToken>
          <Component {...pageProps} />
        </CheckToken>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;