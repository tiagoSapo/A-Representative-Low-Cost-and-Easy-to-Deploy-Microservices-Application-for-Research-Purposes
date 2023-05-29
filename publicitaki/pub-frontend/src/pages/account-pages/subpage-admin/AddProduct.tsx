import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Domains from "../../../utils/Domains";

const AddProduct = () => {
  const navigate = useNavigate();
  const [productType, setProductType] = useState<string>("normal");

  const handleProductTypeChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setProductType(event.target.value);
  };

  function handleCancelButton() {
    navigate("/admin/manage-products");
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Set the file's extension
    const file = formData.get("file") as File;
    const fileExtension = file.name.split(".").pop();
    formData.set("file-extension", fileExtension as string);

    for (const entry of formData.entries()) {
      console.log(entry);
    }

    let URL;
    switch (productType) {
      case "home-appliance":
        URL = Domains.PostHomeAppliance();
        break;
      case "videogame":
        URL = Domains.PostVideogame();
        break;
      case "computer":
        URL = Domains.PostComputer();
        break;
      default:
        URL = Domains.PostProduct();
    }

    // Handle form submission
    axios
      .post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Success");
        console.log("Success:", response);
        navigate("/admin/manage-products");
      })
      .catch((error) => {
        alert("Error");
        console.error("Error:", error);
      });
  };

  return (
    <div className="container my-5">
      <h1>New Product</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="productType" className="mb-3">
          <Form.Label>Product Type:</Form.Label>
          <Form.Control
            as="select"
            value={productType}
            onChange={handleProductTypeChange}
          >
            <option value="normal">Normal</option>
            <option value="videogame">Videogame</option>
            <option value="computer">Computer</option>
            <option value="home-appliance">Home Appliance</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Product's name"
            required
            minLength={10}
            maxLength={100}
          />
        </Form.Group>

        <Form.Group controlId="brand" className="mb-3">
          <Form.Label>Brand:</Form.Label>
          <Form.Control
            type="text"
            name="brand"
            placeholder="Product's brand"
            required
            minLength={1}
            maxLength={100}
          />
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description:</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            placeholder="Product's description"
            required
            minLength={1}
            maxLength={250}
          />
        </Form.Group>

        <Form.Group controlId="photo" className="mb-3">
          <Form.Label>Photo:</Form.Label>
          <Form.Control
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp"
            required
          />
        </Form.Group>
        {/*
        <Form.Group controlId="photo-extension" className="mb-3">
          <Form.Label>Photo Extension:</Form.Label>
          <Form.Control as="select" name="photo-extension">
            <option value="jpg">jpg</option>
            <option value="png">png</option>
            <option value="webp">webp</option>
          </Form.Control>
        </Form.Group>*/}

        {productType === "videogame" && (
          <>
            <Form.Group controlId="platform" className="mb-3">
              <Form.Label>Platform:</Form.Label>
              <Form.Control
                type="text"
                name="platform"
                placeholder="Playstation, Xbox or Nintendo"
                required
                minLength={1}
                maxLength={100}
              />
            </Form.Group>

            <Form.Group controlId="release-date" className="mb-3">
              <Form.Label>Release Date:</Form.Label>
              <Form.Control
                type="text"
                name="release-date"
                placeholder="Enter release date"
                required
              />
            </Form.Group>
          </>
        )}

        {productType === "computer" && (
          <>
            <Form.Group controlId="formOS" className="mb-3">
              <Form.Label>Operating System:</Form.Label>
              <Form.Control
                type="text"
                name="os"
                placeholder="Enter operating system"
                required
                minLength={1}
                maxLength={100}
              />
            </Form.Group>
            <Form.Group controlId="formCPU" className="mb-3">
              <Form.Label>CPU:</Form.Label>
              <Form.Control
                type="text"
                name="cpu"
                placeholder="Enter CPU"
                required
                minLength={1}
                maxLength={100}
              />
            </Form.Group>

            <Form.Group controlId="formSTORAGE" className="mb-3">
              <Form.Label>Storage:</Form.Label>
              <Form.Control
                type="text"
                name="storage"
                placeholder="Enter storage size"
                required
                minLength={1}
                maxLength={100}
              />
            </Form.Group>

            <Form.Group controlId="formMEMORY" className="mb-3">
              <Form.Label>Memory (RAM):</Form.Label>
              <Form.Control
                type="text"
                name="memory"
                placeholder="Enter memory"
                required
                minLength={1}
                maxLength={100}
              />
            </Form.Group>

            <Form.Group controlId="formRESOLUTION" className="mb-3">
              <Form.Label>Resolution:</Form.Label>
              <Form.Control
                type="text"
                name="screen-resolution"
                placeholder="Enter screen resolution (i.e. 1440x900)"
                required
                minLength={1}
                maxLength={100}
              />
            </Form.Group>

            <Form.Group controlId="formSIZE" className="mb-3">
              <Form.Label>Resolution:</Form.Label>
              <Form.Control
                type="text"
                name="screen-size"
                placeholder="Enter screen size in inches (i.e. 30'')"
                required
                minLength={1}
                maxLength={100}
              />
            </Form.Group>
          </>
        )}

        {productType === "home-appliance" && (
          <>
            <Form.Group controlId="formColor" className="mb-3">
              <Form.Label>Color:</Form.Label>
              <Form.Control
                type="text"
                name="color"
                placeholder="Enter color"
                required
                minLength={1}
                maxLength={100}
              />
            </Form.Group>
            <Form.Group controlId="formDimension" className="mb-3">
              <Form.Label>Dimension:</Form.Label>
              <Form.Control
                type="text"
                name="dimension"
                placeholder="Enter dimension"
                required
                minLength={1}
                maxLength={100}
              />
            </Form.Group>
          </>
        )}

        <Button variant="primary" type="submit" style={{ marginRight: "5px" }}>
          Submit
        </Button>
        <a className="btn btn-secondary" onClick={handleCancelButton}>
          Cancel
        </a>
      </Form>
    </div>
  );
};

export default AddProduct;
