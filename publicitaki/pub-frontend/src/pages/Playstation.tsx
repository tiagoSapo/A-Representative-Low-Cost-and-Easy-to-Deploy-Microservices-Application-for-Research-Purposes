import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import Domains from "../utils/Domains";
import { IProduct, IVideoGame } from "../utils/Interfaces";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Playstation() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [serverError, setServerError] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getProductsAsycn = async () => {
      try {
        const response = await axios.get(Domains.GetPlaystationProducts());
        setProducts(response.data);
      } catch (err) {
        console.error(
          `Error: Cannot fetch products from ${Domains.GetPlaystationProducts()}`
        );
        setServerError(true);
      }
    };
    getProductsAsycn();
  }, []);

  const viewProduct = (id: number) => {
    navigate("/products/" + id);
  };

  return (
    <div className="div-home">
      <Container className="my-5">
        <Row xs={1} md={4} className="g-4 align-items-center">
          {serverError && <p className="text-danger">Server unavaliable!</p>}
          {products.length <= 0 && (
            <p className="text-primary">There are no products available</p>
          )}
          {products.map((product) => (
            <Col key={product.id}>
              <Card className="h-100">
                <Image
                  src={Domains.GetImages(product.picture)}
                  className="card-img-top product-thumbnail"
                  alt="product"
                  fluid
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <Button
                    onClick={() => viewProduct(product.id)}
                    variant="info"
                  >
                    View Product
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Playstation;
