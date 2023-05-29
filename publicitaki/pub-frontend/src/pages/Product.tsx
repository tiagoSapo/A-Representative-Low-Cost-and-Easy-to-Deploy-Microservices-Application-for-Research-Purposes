import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import {
  ICustomer,
  IFollower,
  IFollowers,
  IOpinion,
  IPrices,
  IProduct,
  IStore,
} from "../utils/Interfaces";
import axios from "axios";
import Domains from "../utils/Domains";
import ProductRating from "../components/ProductRating";
import { EMAIL, PASSWORD, ROLE } from "../utils/AuthKeys";

const Product = () => {
  // Product's id
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<IFollower>();

  const [buttonText, setButtonText] = useState<string>();
  const [imageUrl, setImage] = useState<string>();
  const [product, setProduct] = useState<IProduct>();
  const [prices, setPrices] = useState<IPrices[]>([]);
  const [opinions, setOpinions] = useState<IOpinion[]>([]);

  const handleOpinionClick = (
    productId: string | undefined,
    opinionId: number
  ) => {
    if (typeof productId === "undefined") {
      console.error("Problem redirecting user");
    }
    navigate("/products/" + productId + "/opinions/" + opinionId);
  };

  const isAuthenticatedAsCustomer = () => {
    if (
      localStorage.getItem(EMAIL) &&
      localStorage.getItem(PASSWORD) &&
      localStorage.getItem(ROLE) === "customer"
    ) {
      return true;
    }
    return false;
  };

  const followProduct = async () => {
    console.log("Follow product");
    try {
      const response = await axios.post(
        Domains.FollowProduct(id, customer?.id)
      );
      alert("You follow this product now.");
      return true;
    } catch {
      alert("Error. Cannot follow product.");
      return false;
    }
  };
  const unfollowProduct = async () => {
    console.log("Deixar de seguir produto!!!");
    try {
      const response = await axios.delete(
        Domains.UnfollowProduct(id, customer?.id)
      );
      alert("You unfollowed this product.");
      return true;
    } catch {
      alert("Error. Cannot unfollow product.");
      return false;
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(Domains.GetProductsById(id));
        setProduct(response.data);
        setImage(Domains.GetImages(response.data.picture));
      } catch (err) {
        console.error(
          `Error: Cannot fetch product with id ${id} from ${Domains.GetProductsById(
            id
          )}`
        );
      }
    };

    const getProductPrices = async () => {
      try {
        const response = await axios.get(Domains.GetProductPrices(id));
        const prices = [];

        for (const element of response.data) {
          const store = await getStore(element.store);
          if (store === null) {
            element.storeName = element.store;
            element.storeUrl = "";
            prices.push(element);
            continue;
          }
          element.storeName = store.name;
          element.storeUrl = store.websiteUrl;
          prices.push(element);
        }

        setPrices(prices);
      } catch (err) {
        console.error(
          `Error: Cannot fetch Prices of product with id ${id}from URL`
        );
      }

      const checkIfCustomerFollowsProduct = () => {
        if (!isAuthenticatedAsCustomer()) {
          return;
        }

        if (isAuthenticatedAsCustomer()) {
          axios
            .get(Domains.GetCustomerByEmail(localStorage.getItem(EMAIL)))
            .then((response) => {
              const customerId: string = response.data.id;
              setCustomer(response.data);
              axios
                .get(Domains.GetProductFollowers(id))
                .then((response) => {
                  const followers: IFollowers[] = response.data;

                  const follower = followers.find(
                    (element) => element.follower.toString() == customerId
                  );
                  follower
                    ? setButtonText("Unfollow")
                    : setButtonText("Follow");
                })
                .catch((err) => {
                  console.log(err);
                  console.log(customer);
                  setButtonText("Cannot follow product");
                });
            })
            .catch(() => {
              console.error("Cannot get customer from User Service!");
            });
        }
      };

      checkIfCustomerFollowsProduct();
    };

    const getProductOpinions = async () => {
      try {
        const response = await axios.get(Domains.GetProductOpinions(id));
        const promises = response.data.map(async (o: IOpinion) => {
          try {
            const customerResponse = await axios.get(
              Domains.GetCustomerById(o.customer.toString())
            );
            o.customerName = customerResponse.data.name;
          } catch {
            // handle error if customer request fails
            o.customerName = o.customer.toString();
          }
          return o;
        });

        const tempOpinions = await Promise.all(promises);
        setOpinions(tempOpinions);
      } catch (err) {
        console.error(
          `Error: Cannot fetch Opinions of product with id ${id} from URL`
        );
      }
    };

    getProduct();
    getProductPrices();
    getProductOpinions();
  }, []);

  async function getStore(store: number): Promise<IStore> {
    return await axios
      .get(Domains.GetStoreById(store))
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(
          `Failed to fetch store using ID ${id}. Store doesn't exist`
        );

        return null;
      });
  }

  return (
    <div className="div-home div-margin-bottom">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h2>{product?.name}</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <img
              src={imageUrl}
              alt={product?.name}
              width={"170px"}
              height={"200px"}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <p style={{ marginTop: "10px", marginBottom: "20px" }}>
              <b>Brand:</b> {product?.brand}
            </p>
          </div>
          <div className="col-md-12 text-center">
            <p style={{ marginTop: "10px", marginBottom: "20px" }}>
              <b>Description:</b> {product?.description}
            </p>
          </div>
        </div>
        {isAuthenticatedAsCustomer() && (
          <div
            className="col-md-12 text-center"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <p
              style={{
                marginTop: "10px",
                marginBottom: "20px",
                marginRight: "5px",
              }}
            >
              <b>Follow product:</b>
            </p>
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (buttonText === "Follow") {
                  (await followProduct()) && setButtonText("Unfollow");
                } else if (buttonText === "Unfollow") {
                  (await unfollowProduct()) && setButtonText("Follow");
                } else {
                  /* do nothing (button text hasn't been set yet) */
                }
              }}
            >
              {buttonText}
            </button>
          </div>
        )}
        <div className="row">
          <div style={{ marginTop: "20px" }} className="col-md-12 text-center">
            <h3>Prices (€)</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Store</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {prices.map((element) => {
                  return (
                    <tr key={element?.id}>
                      <td>{element?.id}</td>
                      <td>{element?.storeName}</td>
                      <td>{element?.price.toFixed(2)}€</td>
                      <td>
                        <Button
                          onClick={() => {
                            window.location.href = element?.storeUrl;
                          }}
                        >
                          Check out store
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {prices.length <= 0 && (
              <p className="text-primary" style={{ marginTop: "10px" }}>
                There are no prices for this product yet.
              </p>
            )}
          </div>
        </div>
        <div className="row">
          <div style={{ marginTop: "20px" }} className="col-md-12 text-center">
            <h3>Opinions</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            {isAuthenticatedAsCustomer() && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigate("/products/" + product?.id + "/add-opinion");
                }}
              >
                Add opinion
              </button>
            )}

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Title</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {opinions.map((element) => (
                  <tr key={element?.id}>
                    <td>{element?.customerName}</td>
                    <td>
                      <ProductRating size={"small"} rating={element?.rating} />
                    </td>
                    <td>{element?.title}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleOpinionClick(id, element?.id)}
                      >
                        Check opinion
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {opinions.length <= 0 && (
              <p className="text-primary" style={{ marginTop: "10px" }}>
                There are no opinions for this product yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
