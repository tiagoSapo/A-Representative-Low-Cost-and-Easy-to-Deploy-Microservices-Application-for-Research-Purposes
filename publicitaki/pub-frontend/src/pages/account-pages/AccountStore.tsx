import React from "react";
import { Card, Button, Image } from "react-bootstrap";
import settingsThumbnail from "../../assets/user.png";
import productsThumbnail from "../../assets/cabinet.png";
import priceThumbnail from "../../assets/price.png";
import subscriptionThumbnail from "../../assets/subscription.png";
import registrationThumbnail from "../../assets/registration.png";
import { useNavigate } from "react-router-dom";
import { EMAIL } from "../../utils/AuthKeys";

function AccountStore() {
  const navigate = useNavigate();

  return (
    <div className="container my-3">
      <h2 style={{ marginBottom: "20px" }}>
        Welcome {localStorage.getItem(EMAIL)}
      </h2>
      <div className="row">
        <div className="col-sm-6 col-lg-4 mb-4">
          <Card>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Image
                src={settingsThumbnail}
                height={200}
                width={200}
                alt="settings"
              />
            </Card.Body>
            <Card.Body>
              <Card.Title>Account Settings</Card.Title>
              <Card.Text>
                Change your account information, such as your email or password.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/store/account-info");
                }}
              >
                Go to Settings
              </Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm-6 col-lg-4 mb-4">
          <Card>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Image
                src={productsThumbnail}
                height={200}
                width={200}
                alt="followed products"
              />
            </Card.Body>
            <Card.Body>
              <Card.Title>My Products</Card.Title>
              <Card.Text>View your registered products.</Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/store/products");
                }}
              >
                View my Products
              </Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm-6 col-lg-4 mb-4">
          <Card>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Image
                src={subscriptionThumbnail}
                height={200}
                width={200}
                alt="subscription"
              />
            </Card.Body>
            <Card.Body>
              <Card.Title>Pay a Subscription</Card.Title>
              <Card.Text>Pay monthly fee.</Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/store/subscription");
                }}
              >
                Pay Subscription
              </Button>
            </Card.Body>{" "}
          </Card>{" "}
        </div>
        <div className="col-sm-6 col-lg-4 mb-4">
          <Card>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Image
                src={registrationThumbnail}
                height={200}
                width={200}
                alt="request new product registration"
              />
            </Card.Body>
            <Card.Body>
              <Card.Title>Request New Product Registration</Card.Title>
              <Card.Text>
                Request a new product to be registered by the administrator.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/store/notification-registration");
                }}
              >
                Request Product Registration
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AccountStore;
