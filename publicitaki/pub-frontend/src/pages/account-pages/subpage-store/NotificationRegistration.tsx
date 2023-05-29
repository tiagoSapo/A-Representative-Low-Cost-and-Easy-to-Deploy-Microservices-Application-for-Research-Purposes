import React, { ChangeEvent, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import image from "../../../assets/registration.png";
import axios from "axios";
import Domains from "../../../utils/Domains";

function NotificationRegistration() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [operationType, setOperationType] = useState<string>("create");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // call axios ->(accountName, accountEmail, accountPassword);
    // PUT store -> user service
    const json = JSON.stringify({
      title: title,
      description: description,
      operation_type: operationType,
    });

    axios
      .post(Domains.PostAdminNotification(), json, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert(`Notification '${title}' sent to the administrator`);
        navigate("/store");
      })
      .catch(() => {
        alert("Error!");
      });
    console.log(json);
  };

  const handleOperationTypeChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setOperationType(event.target.value);
  };

  function handleCancel(): void {
    navigate("/store");
  }

  return (
    <div className="container div-opinion">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="horizontal" style={{ margin: "20px 0" }}>
          <img
            src={image}
            width={100}
            height={100}
            style={{ marginRight: "20px" }}
          />
          <h1>Product Registration Request</h1>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            required
            minLength={1}
            maxLength={20}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter description"
            value={description}
            required
            minLength={1}
            maxLength={250}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Operation type:</Form.Label>
          <Form.Control
            as="select"
            value={operationType}
            onChange={handleOperationTypeChange}
          >
            <option value="create">Insert new product</option>
            <option value="update">Update existing product</option>
            <option value="delete">Delete product</option>
            <option value="other">Other</option>
          </Form.Control>
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
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default NotificationRegistration;
