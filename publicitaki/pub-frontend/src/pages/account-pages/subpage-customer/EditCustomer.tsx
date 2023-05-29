import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import image from "../../../assets/user.png";
import axios from "axios";
import Domains from "../../../utils/Domains";
import { ICustomer } from "../../../utils/Interfaces";
import { EMAIL } from "../../../utils/AuthKeys";

function EditCustomer() {
  const navigate = useNavigate();

  if (localStorage.getItem(EMAIL) === null) {
    alert("Invalid cookies! Please logout and login again.");
    navigate("/");
  }

  const [account, setAccount] = useState<ICustomer>({} as ICustomer);
  const [newName, setNewName] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    axios
      .get(Domains.GetCustomerByEmail(localStorage.getItem(EMAIL)))
      .then((response) => {
        console.log(response.data);
        setAccount(response.data);
        setNewName(response.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // call axios ->(accountName, accountEmail, accountPassword);
    // PUT customer -> user service

    if (oldPassword !== account.password) {
      alert("Invalid credentials. Impossible to update your account!");
      return;
    }

    console.log(oldPassword);
    console.log(newPassword);

    console.log(
      JSON.stringify({
        name: newName,
        password: newPassword,
      })
    );

    axios
      .put(
        Domains.UpdateCustomerByEmail(account.email),
        JSON.stringify({
          name: newName,
          password: newPassword,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        alert("Customer's info updated sucessfully.");
        navigate("/customer");
      })
      .catch((err) => {
        alert("Problem saving customer's info: " + err);
      });
  };

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
          <h1>Edit Account Information</h1>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            onChange={(e) => setNewName(e.target.value)}
            required
            minLength={5}
            maxLength={250}
            value={account?.name ?? ""}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            plaintext
            readOnly
            defaultValue={account?.email}
            style={{ fontWeight: "bold" }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Old password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setOldPassword(e.target.value)}
            required
            minLength={1}
            maxLength={250}
            value={oldPassword}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={5}
            maxLength={250}
            value={newPassword}
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
              navigate("/customer");
            }}
          >
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default EditCustomer;
