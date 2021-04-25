import React, { ReactNode } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

type Props = {
  title: ReactNode,
  heading: ReactNode,
  extra?: ReactNode,

};

const StatCard = ({ title, heading, extra }: Props) => (
  <Card body>
    <Row className="align-items-center">
      <Col>
        <h6 className="text-uppercase text-muted mb-2">
          {title}
        </h6>
        <span className="h2 mb-0">
          {heading}
        </span>
      </Col>
      {extra && (
        <Col xs="auto">
          {extra}
        </Col>
      )}
    </Row>
  </Card>
);

export default StatCard;
