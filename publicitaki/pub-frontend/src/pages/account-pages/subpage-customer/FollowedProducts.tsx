import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import Domains from "../../../utils/Domains";
import { ICustomer, IFollower, IOpinion } from "../../../utils/Interfaces";
import { EMAIL } from "../../../utils/AuthKeys";
import { useNavigate } from "react-router-dom";
import ProductRating from "../../../components/ProductRating";

function FollowedProducts() {
  const [products, setProducts] = useState<IFollower[]>([]);
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<IFollower>();

  if (!localStorage.getItem(EMAIL)) {
    alert("You're not authenticated! Please logout and login again.");
    navigate(-1);
    return <div></div>;
  }

  const getProductsOfFollower = () => {
    axios
      .get(Domains.GetCustomerByEmail(localStorage.getItem(EMAIL)))
      .then((response) => {
        setCustomer(response.data);
        axios
          .get(Domains.GetFollowerProducts(response.data.id))
          .then((response) => {
            setProducts(response.data);
          })
          .catch((error) => {
            alert("Problem connecting to the products server: " + error);
          });
      })
      .catch((error) => {
        alert("Problem connecting to the user server: " + error);
      });
  };

  useEffect(() => {
    getProductsOfFollower();
  }, []);

  return (
    <div className="div-home-not-centered" style={{ marginTop: "10px" }}>
      <div className="table-container">
        <h2 style={{ marginBottom: "40px" }}>Followed products</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Image</th>
              <th>Brand</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((products) => (
              <tr key={products.id}>
                <td>{products.product.name}</td>
                <td>
                  <img
                    src={Domains.GetImages(products.product.picture)}
                    width={50}
                    height={60}
                  />
                </td>
                <td>{products.product.brand}</td>
                <td>{products.product.description}</td>
                <td>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (
                        confirm(
                          `Do you really want to unfollow product '${products.product.name}'?`
                        )
                      ) {
                        if (customer === undefined || customer == null) {
                          alert("Cannot unfollow product");
                          return;
                        }

                        axios
                          .delete(
                            Domains.UnfollowProduct(
                              products.product.id.toString(),
                              customer.id
                            )
                          )
                          .then(() => {
                            alert(
                              `Unfollowed product '${products.product.name}'.`
                            );
                            getProductsOfFollower();
                          })
                          .catch(() => {
                            alert("Cannot unfollow product");
                          });
                      }
                    }}
                  >
                    Unfollow
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {products.length <= 0 && (
          <p className="text-primary">You haven't followed a product yet</p>
        )}
      </div>
    </div>
  );
}

export default FollowedProducts;
