import { Card, ListGroup } from "react-bootstrap";
import { IOpinion } from "../utils/Interfaces";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductRating from "../components/ProductRating";
import Domains from "../utils/Domains";

function ProductOpinions() {
  const { productId, opinionId } = useParams();

  const [opinion, setOpinion] = useState<IOpinion>();
  const [customerName, setCustomerName] = useState<string>("");

  useEffect(() => {
    const getOpinion = async () => {
      try {
        const response = await axios.get(Domains.GetOpinion(opinionId), {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setOpinion(response.data);
        getCustomerNameById(response.data.customer);
      } catch (err) {
        console.error(`Error: Cannot fetch opinions`);
      }
    };
    const getCustomerNameById = async (customerId: string | null) => {
      try {
        const response = await axios.get(Domains.GetCustomerById(customerId));
        setCustomerName(response.data.name);
      } catch (err) {
        console.error(`Error: Cannot fetch opinions`);
      }
    };

    getOpinion();
  }, []);

  return (
    <div className="div-home-not-centered">
      <div className="container mt-3">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h3>Opinion for '{opinion?.["product-details"].name}'</h3>
                <img
                  src={Domains.GetImages(opinion?.["product-details"].picture)}
                  width={200}
                  height={250}
                ></img>
              </div>
              <div className="card-body">
                <h3 className="card-title">{opinion?.title}</h3>
                <p className="card-text">{opinion?.description}</p>
                <ProductRating size={"small"} rating={opinion?.rating} />
                <p className="card-text">
                  <small className="text-muted">By {customerName}</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /*
  return (
    <Card>
      <Card.Header>Opinions</Card.Header>
      <ListGroup variant="flush">
        {opinion.map((opinion) => (
          <ListGroup.Item key={opinion.id}>
            <h5>{opinion.title}</h5>
            <div className="d-flex justify-content-between">
              <small>Rating: {opinion.rating}</small>
              <small>Customer: {opinion.customer}</small>
            </div>
            <p>{opinion.description}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );*/
}

export default ProductOpinions;
