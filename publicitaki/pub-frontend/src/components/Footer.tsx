import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-light py-3 footer">
      <Container>
        <Row>
          <Col md={6}>&copy; 2023 - Publicitaki</Col>
          <Col md={6} className="text-md-end">
            Terms of service
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
