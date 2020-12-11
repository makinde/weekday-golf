import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';

const ITEMS = [
  { path: '', label: 'Overview' },
  { path: 'rounds', label: 'Rounds' },
];

const DEFAULT_ITEM = '';

const Emoji = () => (
  <span aria-label="weekday-golf" role="img">🏌🏾‍♂</span>
);

const Layout = ({ children, title }) => {
  const { pathname } = useRouter();
  const activeKey = pathname.replace('/', '') || DEFAULT_ITEM;

  return (
    <>
      <Head>
        <title>
          Weekday Golf ·
          {title}
        </title>
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preload" as="font" type="font/woff" crossOrigin="anonymous" href="/static/fonts/cerebrisans/cerebrisans-regular.woff" />
        <link rel="preload" as="font" type="font/woff" crossOrigin="anonymous" href="/static/fonts/cerebrisans/cerebrisans-medium.woff" />
        <link rel="preload" as="font" type="font/woff" crossOrigin="anonymous" href="/static/fonts/cerebrisans/cerebrisans-semibold.woff" />
        <link rel="preload" as="font" type="font/woff" crossOrigin="anonymous" href="/static/fonts/feather/fonts/Feather.woff" />
      </Head>
      <Navbar
        className="justify-content-between"
        sticky="top"
      >
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand>
              <Emoji />
              {' '}
              Weekday Golf
            </Navbar.Brand>
          </Link>
          <Nav activeKey={activeKey}>
            {ITEMS.map(({ label, path }) => (
              <Link href={`/${path}`} key={path} passHref>
                <Nav.Link eventKey={path}>
                  {label}
                </Nav.Link>
              </Link>
            ))}
          </Nav>
        </Container>
      </Navbar>
      <Container>
        {children}
      </Container>
    </>
  );
};

export default Layout;
