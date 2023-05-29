import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { IProduct } from "../../../utils/Interfaces";
import Domains from "../../../utils/Domains";
import { useNavigate } from "react-router-dom";
import { ID } from "../../../utils/AuthKeys";

const AddPrice = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>();
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!localStorage.getItem(ID)) {
      alert("This account is not valid! Please logout.");
      navigate("/");
    }

    axios
      .get(Domains.GetStoreProductsWithoutPrice(localStorage.getItem(ID)))
      .then((response) => {
        setProducts(response.data);
        setSelectedProduct(response.data.at(0)?.id.toString());
      });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // submit price
    axios
      .post(
        Domains.PostPriceForStore(localStorage.getItem(ID), selectedProduct),
        JSON.stringify({ price: price }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        alert(`Success. Added price ${price} for product ${selectedProduct}`);
        navigate("/store/products");
      })
      .catch((event) => {
        alert(`Error: ${event}!`);
      });
  };

  return (
    <div className="div-home-not-centered">
      <div className="container mt-5">
        <h3 className="mb-3">Add Price to Product</h3>
        {products ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select a Product:</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price in EURO (€):</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                placeholder="0.00€"
                required
                style={{ width: "150px" }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button
                variant="primary"
                type="submit"
                style={{ marginRight: "5px" }}
              >
                Add Price
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate("/store/products");
                }}
              >
                Cancel
              </Button>
            </Form.Group>
          </Form>
        ) : (
          <p className="text-primary">There are no products on the system!</p>
        )}
      </div>
    </div>
  );
};

export default AddPrice;
