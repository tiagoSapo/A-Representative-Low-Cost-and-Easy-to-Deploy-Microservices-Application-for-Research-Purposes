import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import Domains from "../../../utils/Domains";
import { IOpinion } from "../../../utils/Interfaces";
import { EMAIL } from "../../../utils/AuthKeys";
import { useNavigate } from "react-router-dom";
import ProductRating from "../../../components/ProductRating";

function ManageOpinions() {
  const [opinions, setOpinions] = useState<IOpinion[]>([]);
  const navigate = useNavigate();

  if (!localStorage.getItem(EMAIL)) {
    alert("You're not authenticated! Please logout and login again.");
    navigate(-1);
    return <div></div>;
  }

  const getOpinions = () => {
    axios
      .get(Domains.GetCustomerByEmail(localStorage.getItem(EMAIL)))
      .then((response) => {
        axios
          .get(Domains.GetOpinionsByCustomer(response.data.id))
          .then((response) => {
            setOpinions(response.data);
          })
          .catch((error) => {
            alert("Problem connecting to the opinion server: " + error);
          });
      })
      .catch((error) => {
        alert("Problem connecting to the user server: " + error);
      });
  };

  useEffect(() => {
    getOpinions();
  }, []);

  return (
    <div className="div-home-not-centered" style={{ marginTop: "10px" }}>
      <div className="table-container">
        <h2 style={{ marginBottom: "40px" }}>My product opinions</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {opinions.map((opinion) => (
              <tr key={opinion.id}>
                <td>{opinion["product-details"].name}</td>
                <td>
                  <img
                    src={Domains.GetImages(opinion["product-details"].picture)}
                    width={50}
                    height={60}
                  />
                </td>
                <td>{opinion.title}</td>
                <td>{opinion.description}</td>
                <td>
                  <ProductRating rating={opinion.rating} size={"small"} />
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (
                        confirm(
                          `Do you really want to delete opinion '${opinion.title}'?`
                        )
                      ) {
                        axios
                          .delete(Domains.DeleteOpinion(opinion.id.toString()))
                          .then(() => {
                            alert(`Opinion ${opinion.id} deleted.`);
                            getOpinions();
                          })
                          .catch(() => {
                            alert(
                              `Error! Opinion '${opinion.title}' cannot deleted.`
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
        {opinions.length <= 0 && (
          <p className="text-primary">You haven't posted an opinion yet</p>
        )}
      </div>
    </div>
  );
}

export default ManageOpinions;
