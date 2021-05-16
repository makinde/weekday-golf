import React, { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import cx from 'classnames';
import {
  Accordion, Container, Nav, Navbar, AccordionContext, useAccordionToggle,
} from 'react-bootstrap';

import Avatar from './Avatar';
import NewRoundButton from '../dataEntry/NewRoundButton';
import { useLayout } from '../../apiHooks';

import styles from './Layout.module.scss';

const keyForId = (id: number) => `nav-${id}`;
enum CoursePage {
  Overview = 'overview',
  Rounds = 'rounds',
}

type AccordionNavProps = React.PropsWithChildren<{eventKey: string}>;
const AccordionNav = ({ children, eventKey }: AccordionNavProps) => {
  const currentEventKey = useContext(AccordionContext);
  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <Nav.Link
      data-toggle="collapse"
      aria-expanded={isCurrentEventKey}
      className={cx('font-weight-bold', { 'text-white': isCurrentEventKey })}
      active={false}
      onClick={useAccordionToggle(eventKey)}
    >
      {children}
    </Nav.Link>
  );
};

type Props = React.PropsWithChildren<{
  title: string,
  focusedCourseId?: number,
  focusedCoursePage?: CoursePage,
  focusedPlayerId?: number,
}>;

const Layout = ({
  title,
  focusedCourseId,
  focusedCoursePage,
  focusedPlayerId,
  children,
}: Props) => {
  const { data } = useLayout({}, { staleTime: Infinity });
  const courses = data?.courses ?? [];

  return (
    <>
      <Head>
        <title>{`Golf · ${title}`}</title>
        <meta name="theme-color" content="#152e4d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, user-scalable=no, viewport-fit=cover" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preload" as="font" type="font/woff" crossOrigin="anonymous" href="/static/fonts/cerebrisans/cerebrisans-regular.woff" />
        <link rel="preload" as="font" type="font/woff" crossOrigin="anonymous" href="/static/fonts/cerebrisans/cerebrisans-medium.woff" />
        <link rel="preload" as="font" type="font/woff" crossOrigin="anonymous" href="/static/fonts/cerebrisans/cerebrisans-semibold.woff" />
        <link rel="preload" as="font" type="font/woff" crossOrigin="anonymous" href="/static/fonts/feather/fonts/Feather.woff" />
      </Head>
      <Navbar expand="md" variant="dark" className={`navbar-vertical fixed-left ${styles.pageNavbar}`} id="sidebar" fixed="top">
        <Container fluid>

          <Link href="/">
            <a className="navbar-brand">
              <span className="display-1 d-none d-md-inline" aria-label="Golf person" role="img">🏌🏾‍♂</span>
              <span className="display-4 d-inline d-md-none" aria-label="Golf person" role="img">🏌🏾‍♂</span>
            </a>
          </Link>

          <Navbar.Toggle aria-controls="sidebarCollapse" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </Navbar.Toggle>

          <Navbar.Collapse id="sidebarCollapse">
            <Accordion defaultActiveKey={focusedCourseId && keyForId(focusedCourseId)}>

              <Nav as="ul" className="navbar-nav">
                {courses.map((course) => {
                  const isCourseSelected = course.id === focusedCourseId;

                  return (
                    <Nav.Item as="li" key={`course-${course.id}`}>
                      <AccordionNav eventKey={keyForId(course.id)}>
                        {course.name}
                      </AccordionNav>
                      <Accordion.Collapse eventKey={keyForId(course.id)}>
                        <Nav as="ul" className="nav nav-sm flex-column" navbar={false}>
                          <Nav.Item as="li" className="pl-5 pr-4 pt-2 pb-3">
                            <NewRoundButton
                              block
                              size="sm"
                              variant="outline-secondary"
                              courseId={course.id}
                            >
                              + New Round
                            </NewRoundButton>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link href={`/${course.slug}`} passHref>
                              <Nav.Link
                                active={isCourseSelected
                                  && focusedCoursePage === CoursePage.Overview}
                                className="pl-5"
                              >
                                Overview
                              </Nav.Link>
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link href={`/${course.slug}/rounds`} passHref>
                              <Nav.Link
                                active={isCourseSelected
                                  && focusedCoursePage === CoursePage.Rounds}
                                className="pl-5"
                              >
                                Rounds
                              </Nav.Link>
                            </Link>
                          </Nav.Item>
                          {course.coursePlayers.map(({ player }) => (
                            <Nav.Item as="li" key={`player-${player.id}`}>
                              <Link href={`/${course.slug}/${player.slug}`} passHref>
                                <Nav.Link
                                  active={isCourseSelected
                                    && focusedPlayerId === player.id}
                                  className="pl-5"
                                >
                                  {player.fullName}
                                  <Avatar className="ml-auto my-n2" size="xs" src={player.img} />
                                </Nav.Link>
                              </Link>
                            </Nav.Item>
                          ))}
                        </Nav>
                      </Accordion.Collapse>
                    </Nav.Item>
                  );
                })}
              </Nav>
            </Accordion>

            {/* Push content down */}
            <div className="mt-auto" />
            <div className="navbar-user d-flex" id="sidebarUser">
              <a href="https://www.github.com/makinde/weekday-golf" className="navbar-user-link">
                <span className="icon">
                  <i className="fe fe-github" />
                </span>
              </a>
            </div>

          </Navbar.Collapse>

        </Container>
      </Navbar>
      <div className={`main-content bg-lighter ${styles.content}`}>
        <Container fluid>
          {children}
        </Container>

      </div>
    </>
  );
};

export {
  CoursePage,
  Layout as default,
};
