import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import { ISubscription } from "../../../utils/Interfaces";
import Domains from "../../../utils/Domains";
import { EMAIL } from "../../../utils/AuthKeys";

function StoreSubscriptionDetails() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<ISubscription>({
    active: "false",
    expirationDate: "",
    createdAt: "",
    updatedAt: "",
    id: -1,
    StoreId: -1,
  });

  const handleCharge = () => {
    const email = localStorage.getItem(EMAIL);
    if (!email) {
      alert(
        "Problem getting your user information! Please log out and log in again."
      );
      return;
    }

    axios
      .post(Domains.PaySubscription(email))
      .then(() => {
        alert(
          "Success! The bank's confirmation may take a while to be received."
        );
      })
      .catch(() => {
        alert(
          "There was a problem contacting your bank. Contact the admin of Publicitaki!"
        );
      });
  };

  useEffect(() => {
    if (localStorage.getItem(EMAIL)) {
      axios
        .get(Domains.GetStoreSubscription(localStorage.getItem(EMAIL)))
        .then((response) => {
          setSubscription(response.data);
        })
        .catch((error) => alert("Problem getting your subscription: " + error));
    }
  }, []);

  if (!localStorage.getItem(EMAIL)) {
    alert(
      "Problem getting your user account. Please log out and log in again."
    );
    navigate("/");
    return <div></div>;
  }

  if (!subscription) {
    return <div>Loading...</div>;
  }

  const statusColor = subscription.active ? "green" : "red";

  return (
    <div className="div-home-not-centered">
      <Container>
        <h1 style={{ margin: "40px 0" }}>My subscription status</h1>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Control
              type="text"
              plaintext
              value={subscription.active ? "Active" : "Not active"}
              readOnly
              style={{ fontWeight: "bold", color: statusColor }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control
              type="text"
              plaintext
              value={new Date(subscription.expirationDate).toLocaleDateString()}
              readOnly
              style={{ fontWeight: "bold" }}
            />
          </Form.Group>

          {!subscription.active && (
            <Button
              variant="primary"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure that you want to pay? You will be charged immediately!"
                  )
                ) {
                  handleCharge();
                }
              }}
            >
              Pay subscription
            </Button>
          )}
        </Form>
      </Container>
    </div>
  );
}

export default StoreSubscriptionDetails;
