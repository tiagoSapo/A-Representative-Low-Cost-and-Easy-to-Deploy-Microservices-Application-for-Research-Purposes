import React from "react";
import { Card, Button, Image } from "react-bootstrap";
import settingsThumbnail from "../../assets/user.png";
import followThumbnail from "../../assets/fav.png";
import opinionThumbnail from "../../assets/info.png";
import { EMAIL } from "../../utils/AuthKeys";
import { useNavigate } from "react-router-dom";

function AccountCustomer() {
  const navigate = useNavigate();

  return (
    <div className="container my-3 div-opinion">
      <h3 style={{ marginBottom: "30px" }}>
        Welcome{" "}
        <span style={{ color: "rgb(0, 102, 153)" }}>
          {localStorage.getItem(EMAIL)}{" "}
        </span>
      </h3>
      <div className="row">
        <div className="col-sm-6 col-lg-4 mb-4">
          <Card>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Image
                src={settingsThumbnail}
                height={220}
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
                  navigate("/customer/edit");
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
                src={followThumbnail}
                height={220}
                width={200}
                alt="followed products"
              />
            </Card.Body>
            <Card.Body>
              <Card.Title>Followed Products</Card.Title>
              <Card.Text>
                View the products that you are currently following.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/customer/followed-products");
                }}
              >
                View Followed Products
              </Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm-6 col-lg-4 mb-4">
          <Card>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Image
                src={opinionThumbnail}
                height={220}
                width={200}
                alt="opinions"
              />
            </Card.Body>
            <Card.Body>
              <Card.Title>Opinions</Card.Title>
              <Card.Text>View all your product opinions</Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/customer/opinions");
                }}
              >
                View my product opinions
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AccountCustomer;
