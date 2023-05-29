import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { INotification } from "../../../utils/Interfaces";
import Domains from "../../../utils/Domains";
import "../../../styles/App.css"; // Import the CSS file

function Notifications() {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const getAdminNotificationsAsync = () => {
    axios
      .get(Domains.GetAdminNotifications())
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.log(error);
        window.alert("Problem connecting to the notification server: " + error);
      });
  };

  useEffect(() => {
    getAdminNotificationsAsync();
  }, []);

  return (
    <div className="div-opinion">
      <div className="table-container">
        <h1>Notifications</h1> {/* Use a container div */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification._id}>
                <td>{notification._id}</td>
                <td>{notification.title}</td>
                <td>{notification.description}</td>
                <td>{notification.date}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (
                        confirm(
                          `Do you really want to delete notification ${notification._id}?`
                        )
                      ) {
                        axios
                          .delete(
                            Domains.DeleteAdminNotification(notification._id)
                          )
                          .then(() => {
                            alert(`Notification ${notification._id} deleted.`);
                            getAdminNotificationsAsync();
                          })
                          .catch(() => {
                            alert(
                              `Error! Notification ${notification._id} cannot deleted.`
                            );
                          });
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {notifications.length <= 0 && (
          <p className="text-primary">There are no notifications</p>
        )}
      </div>
    </div>
  );
}

export default Notifications;
