import React from 'react';
import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        {/* Blank onTouchStart helps with PWA look and feel.
        See: https://medium.com/appscope/designing-native-like-progressive-web-apps-for-ios-1b3cdda1d0e8 */}
        <body onTouchStart={() => {}}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
