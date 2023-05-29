import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { IProduct } from "../../../utils/Interfaces";
import Domains from "../../../utils/Domains";
import "../../../styles/App.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    axios
      .get(Domains.GetProducts())
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
        window.alert("Problem connecting to the product server: " + error);
      });
  }, []);

  async function deleteProduct(id: number) {
    try {
      await axios.delete(Domains.DeleteProduct(id));
      const response = await axios.get(Domains.GetProducts());
      setProducts(response.data);
      alert("Product deleted!");
    } catch (err) {
      const errorMsg = `Error: Cannot delete product ${id} from ${Domains.DeleteProduct(
        id
      )}`;
      console.error(errorMsg);
      alert(errorMsg);
    }
  }

  return (
    <div className="div-home">
      <div className="table-container">
        <h1>Products</h1> {/* Use a container div */}
        <Button
          variant="success"
          style={{ marginBottom: "10px" }}
          onClick={() => {
            navigate("/admin/manage-products/add-product");
          }}
        >
          Add product
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Photo name</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img
                    src={Domains.GetImages(product.picture)}
                    style={{
                      display: "block",
                      maxWidth: "50px",
                      minWidth: "50px",
                      height: "auto",
                      width: "auto",
                    }}
                  />
                </td>
                <td>{product.picture}</td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.description}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure that you want to delete product with ID = ${product.id}?`
                        )
                      ) {
                        // Delete product!
                        deleteProduct(product.id);
                      } else {
                        // Do nothing!
                        console.log("Thing was not saved to the database.");
                      }
                      console.log(`View product with ID ${product.id}`);
                    }}
                  >
                    DELETE
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ManageProducts;
