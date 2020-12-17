import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

type Props = {
  title: React.ReactNode,
  heading: React.ReactNode,
  icon?: string,
};

const StatCard = ({ title, heading, icon }: Props) => (
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
      {icon && (
        <Col xs="auto">
          <span className={`h2 fe fe-${icon} text-muted mb-0`} />
        </Col>
      )}
    </Row>
  </Card>
);

export default StatCard;
