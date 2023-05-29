import React from "react";
import { Card, Button, Image } from "react-bootstrap";
import notificationThumbnail from "../../assets/mails.png";
import productThumbnail from "../../assets/cabinet.png";
import { useNavigate } from "react-router-dom";

function AccountAdmin() {
  const navigate = useNavigate();

  const handleNotifications = () => {
    navigate("/admin/notifications");
  };

  return (
    <div className="container my-3 div-opinion">
      <div className="row">
        <div className="col-sm-6 col-lg-4 mb-4">
          <Card>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Image
                src={notificationThumbnail}
                height={220}
                width={200}
                alt="notification"
              />
            </Card.Body>
            <Card.Body>
              <Card.Title>Check Notifications</Card.Title>
              <Card.Text>
                View your notifications from customers and stores.
              </Card.Text>
              <Button variant="primary" onClick={handleNotifications}>
                Go to Notifications
              </Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm-6 col-lg-4 mb-4">
          <Card>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Image
                src={productThumbnail}
                height={220}
                width={200}
                alt="product"
              />
            </Card.Body>
            <Card.Body>
              <Card.Title>Manage Products</Card.Title>
              <Card.Text>Add, edit or delete your products.</Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/admin/manage-products");
                }}
              >
                Manage Products
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AccountAdmin;
