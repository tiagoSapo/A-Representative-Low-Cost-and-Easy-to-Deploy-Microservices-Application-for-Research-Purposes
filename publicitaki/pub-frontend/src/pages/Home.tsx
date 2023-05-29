import { Container, Image, Col, Row } from "react-bootstrap";

// Images
import logo from "../assets/bird.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="div-home">
      <Row className="px-4 my-5">
        <Col sm={5}>
          <Image src={logo} fluid rounded />
        </Col>
        <Col sm={5}>
          <h1 className="font-weight-light">
            Welcome to <span className="blue-color">Publicitaki</span>
          </h1>
          <p className="mt-0 mb-4" style={{ lineHeight: "1.5" }}>
            Our website specializes on tracking prices for products. There are
            200 store who publish products on our website
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate("/products");
            }}
          >
            Click to check products!
          </button>
        </Col>
      </Row>
    </div>
  );
}
export default Home;
