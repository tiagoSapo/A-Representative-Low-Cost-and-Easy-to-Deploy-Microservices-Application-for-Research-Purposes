import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { IPricesDetails, IProduct } from "../../../utils/Interfaces";
import Domains from "../../../utils/Domains";
import "../../../styles/App.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";
import { EMAIL } from "../../../utils/AuthKeys";

function StoreProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IPricesDetails[]>([]);
  const [storeId, setStoreId] = useState<number>();

  useEffect(() => {
    const email = localStorage.getItem(EMAIL);
    if (!email) {
      return;
    }

    axios
      .get(Domains.GetStoreByEmail(email))
      .then((response) => {
        setStoreId(response.data.id);

        axios
          .get(Domains.GetStoreProducts(response.data.id))
          .then((response) => {
            console.log(response.data);
            setProducts(response.data);
          })
          .catch((error) => {
            console.log(error);
            window.alert("Problem connecting to the product server: " + error);
          });
      })
      .catch(() => {
        alert("Error!");
      });
  }, []);

  return (
    <div className="div-home-not-centered">
      <div className="table-container">
        <h1>My Products</h1> {/* Use a container div */}
        <div style={{ margin: "20px 0" }}>
          <p>
            On this page you can view the product that you already added a price
            to. <br />
            You can click on "Add price" to add a price to a product.
          </p>
        </div>
        <Button
          variant="success"
          style={{ marginBottom: "10px" }}
          onClick={() => {
            navigate("/store/products/add-price");
          }}
        >
          Add price
        </Button>
        {products.length <= 0 ? (
          <p className="text-primary" style={{ marginTop: "30px" }}>
            There are no products for store <b>{localStorage.getItem(EMAIL)}</b>{" "}
            with <b>ID = {storeId}</b>
          </p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Description</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={Domains.GetImages(
                        product["product-details"].picture
                      )}
                      style={{
                        display: "block",
                        maxWidth: "50px",
                        minWidth: "50px",
                        height: "auto",
                        width: "auto",
                      }}
                    />
                  </td>
                  <td>{product["product-details"].name}</td>
                  <td>{product["product-details"].brand}</td>
                  <td>{product["product-details"].description}</td>
                  <td>{product.price}€</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure that you want to delete product with ID = ${product.id}?`
                          )
                        ) {
                          // Delete product's price!
                          axios
                            .delete(Domains.DeletePrice(product.id))
                            .then(() => {})
                            .catch(() => {});
                        }
                      }}
                    >
                      Remove price
                    </Button>
                    {/*<Button style={{ marginTop: "5px" }}>Update price</Button>*/}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default StoreProducts;
