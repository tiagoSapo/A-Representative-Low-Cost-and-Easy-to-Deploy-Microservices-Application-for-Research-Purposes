import React, { useState } from "react";
import image from "../../assets/add-user.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Domains from "../../utils/Domains";
import { EMAIL, ID, PASSWORD, ROLE } from "../../utils/AuthKeys";

interface LoginProps {
  setLoggedUser: (isLoggedIn: string | null) => void;
}

const RegistrationPage = (props: LoginProps) => {
  const [userType, setUserType] = useState<string>("customer");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [storeDomain, setStoreDomain] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<string>("");

  const handleUserTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUserType(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // convert user's registration to json
    let json: string | undefined;
    let URL_CREATE, URL_CHECK_ID: string;

    if (userType === "customer") {
      json = JSON.stringify({ name: name, email: email, password: password });
      URL_CREATE = Domains.PostCustomerUser();
      URL_CHECK_ID = Domains.CheckCustomerId(email);
    } else {
      json = JSON.stringify({
        name: name,
        location: location,
        websiteUrl: storeDomain,
        email: email,
        password: password,
        bankAccount: bankAccount,
      });
      URL_CREATE = Domains.PostStoreUser();
      URL_CHECK_ID = Domains.CheckStoreId(email);
    }

    // send it to the service via axios
    axios
      .post(URL_CREATE, json, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        // save authentication on local storage
        localStorage.setItem(EMAIL, email);
        localStorage.setItem(PASSWORD, password);
        localStorage.setItem(ROLE, userType);

        alert(`User ${name} created sucessfully`);
        axios
          .get(URL_CHECK_ID)
          .then((response) => {
            localStorage.setItem(ID, response.data);
          })
          .catch(() => {
            alert("Problem fetching user's id");
          });

        // send to header of website the authenticated name
        props.setLoggedUser(email);
        navigate("/");
      })
      .catch((event) => {
        alert(
          `Error! A user already exists with that name, email or domain (in case of stores).`
        );
        localStorage.clear();
      });
    console.log(json);
  };

  const navigate = useNavigate();
  function handleCancelButton() {
    navigate("/");
  }

  return (
    <div className="div-home">
      <form
        onSubmit={handleSubmit}
        className="container mt-5"
        style={{ marginBottom: "50px" }}
      >
        <img src={image} style={{ marginBottom: "20px" }} alt="form-header" />
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="form-control"
            required
            minLength={1}
            maxLength={250}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Enter you email address"
            onChange={(event) => setEmail(event.target.value)}
            className="form-control"
            required
            minLength={1}
            maxLength={250}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Enter your password (4 minimum and 20 maximum)"
            onChange={(event) => setPassword(event.target.value)}
            className="form-control"
            required
            minLength={1}
            maxLength={250}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="userType" className="form-label">
            Are you a customer or a store?
          </label>
          <select
            id="userType"
            value={userType}
            onChange={handleUserTypeChange}
            className="form-select"
          >
            <option value="customer">Customer</option>
            <option value="store">Store</option>
          </select>
        </div>
        {userType === "store" && (
          <>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location:
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="form-control"
                placeholder="Your store's location"
                required
                minLength={1}
                maxLength={250}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="storeDomain" className="form-label">
                Store Domain:
              </label>
              <input
                type="url"
                id="storeDomain"
                value={storeDomain}
                onChange={(event) => setStoreDomain(event.target.value)}
                className="form-control"
                placeholder="Your store UNIQUE domain (i.e. http://www.example.com)."
                required
                minLength={1}
                maxLength={250}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="bankAccount" className="form-label">
                Bank Account:
              </label>
              <input
                type="number"
                id="bankAccount"
                value={bankAccount}
                onChange={(event) => setBankAccount(event.target.value)}
                className="form-control"
                placeholder="Your store's bank account number (i.e. 5)"
                required
                minLength={1}
                maxLength={250}
              />
            </div>
          </>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginRight: "5px" }}
        >
          Submit
        </button>
        <a className="btn btn-secondary" onClick={handleCancelButton}>
          Cancel
        </a>
      </form>
    </div>
  );
};

export default RegistrationPage;
