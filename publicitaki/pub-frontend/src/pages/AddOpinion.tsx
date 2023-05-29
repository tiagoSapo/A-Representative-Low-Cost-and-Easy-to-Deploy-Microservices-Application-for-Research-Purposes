import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Domains from "../utils/Domains";
import { EMAIL } from "../utils/AuthKeys";

function AddOpinion() {
  const [rating, setRating] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { productId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log({ rating, title, description });

    const customerEmail = localStorage.getItem(EMAIL);

    if (!customerEmail) {
      alert("You're not logged in. Please log in again");
      navigate("/login");
      return;
    }

    if (!productId) {
      alert("Internal frontend problem. Please contact the administrator");
      navigate("-1");
      return;
    }

    // fetching customer's id
    axios
      .get(Domains.GetCustomerByEmail(customerEmail))
      .then((response) => {
        const customerId = response.data.id;
        console.log(customerId);

        // posting the opinion
        axios
          .post(
            Domains.PostOpinion(productId, customerId),
            JSON.stringify({
              rating: rating,
              title: title,
              description: description,
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            alert("Opinion saved!");
            navigate(-1);
          })
          .catch((err) => {
            alert("Problem saving your opinion");
          });
      })
      .catch((err) => {
        alert(
          "There's a problem getting your account. Please contact the administrator."
        );
        navigate("/");
      });
  };

  return (
    <Container className="div-home-not-centered">
      <Form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
        <h3>Add opinion to Product</h3>
        <Form.Group controlId="formRating" className="mb-3">
          <Form.Label>Rating:</Form.Label>
          <Form.Control
            as="select"
            value={rating}
            onChange={(event) => setRating(parseInt(event.target.value))}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value} Stars
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            minLength={5}
            maxLength={250}
          />
        </Form.Group>
        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Description:</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            minLength={5}
            maxLength={250}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Button
            style={{ marginRight: "5px" }}
            variant="primary"
            type="submit"
            className="mr-3"
          >
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default AddOpinion;
