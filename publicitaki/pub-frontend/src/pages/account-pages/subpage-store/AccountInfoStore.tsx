import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Domains from "../../../utils/Domains";
import { EMAIL } from "../../../utils/AuthKeys";

interface LoginProps {
  setLoggedUser: (isLoggedIn: string | null) => void;
}

const AccountInfoStore = (props: LoginProps) => {
  const storeEmail = localStorage.getItem(EMAIL);

  useEffect(() => {
    const getStoreInfo = () => {
      if (storeEmail == null) {
        console.log("Problem getting store's email from cookie");
        navigate("/");
      }

      axios
        .get(Domains.GetStoreByEmail(storeEmail))
        .then((response) => {
          console.log(response);
          setId(response.data.id);
          setName(response.data.name);

          if (response.data.location != null) {
            setLocation(response.data.location);
          }
          setUrl(response.data.websiteUrl);
          setBankAccout(response.data.bankAccount);
        })
        .catch(() => {
          console.log("Problem fetching store's information");
        });
    };

    getStoreInfo();
  }, []);

  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [bankAccount, setBankAccout] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(name);
    console.log(location);
    console.log(url);
    console.log(bankAccount);

    // submit
    if (storeEmail == null) {
      console.log("Problem getting store's email from cookie");
      navigate("/");
    }

    axios
      .put(
        Domains.UpdateStoreByEmail(storeEmail),
        JSON.stringify({
          name: name,
          location: location,
          websiteUrl: url,
          bankAccount: bankAccount,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        alert("Store's info updated sucessfully.");
        navigate("/store");
      })
      .catch((err) => {
        alert("Problem saving store's info: " + err);
      });
  };

  return (
    <div className="div-home-not-centered">
      <Container className="my-3">
        <h2>Account Information</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                minLength={1}
                maxLength={250}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your store's location (i.e. New York)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                minLength={1}
                maxLength={250}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Website URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter your store's URL (i.e. http://www.example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                minLength={1}
                maxLength={250}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bank account</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter your store's bank account (i.e. 4)"
                value={bankAccount}
                required
                onChange={(e) => setBankAccout(e.target.value)}
                step="1"
                min="0"
                max="250"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button
                variant="primary"
                type="submit"
                style={{ marginRight: "5px" }}
              >
                Update info
              </Button>
              <Button
                style={{ marginRight: "5px" }}
                variant="danger"
                onClick={() => {
                  if (
                    confirm(
                      `Are you sure that you want to delete your ${id} account?`
                    )
                  ) {
                    // Delete account
                    axios
                      .delete(Domains.DeleteStore(id))
                      .then(() => {
                        localStorage.clear();
                        props.setLoggedUser(null);
                        axios
                          .delete(Domains.DeleteStorePrices(id))
                          .then(() => {})
                          .catch((err) => {
                            console.log("Cannot delete store's prices: " + err);
                          });
                        navigate("/");
                      })
                      .catch(() => {
                        alert("Problem deleting your account");
                      });
                  }
                }}
              >
                Delete my account
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate("/store/");
                }}
              >
                Cancel
              </Button>
            </Form.Group>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default AccountInfoStore;
