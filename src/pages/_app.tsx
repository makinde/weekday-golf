import React from 'react';

import '../theme/theme.scss';
import '../../public/static/fonts/feather/feather.css';
import './_app.scss';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
