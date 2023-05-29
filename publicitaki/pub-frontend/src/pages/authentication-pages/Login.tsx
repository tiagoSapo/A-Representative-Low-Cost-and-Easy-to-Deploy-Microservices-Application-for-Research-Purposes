import React, { useEffect, useState } from "react";
import image from "../../assets/bird.png";
import { useNavigate } from "react-router-dom";
import { EMAIL, ID, PASSWORD, ROLE } from "../../utils/AuthKeys";
import axios from "axios";
import Domains from "../../utils/Domains";

interface LoginProps {
  setLoggedUser: (isLoggedIn: string | null) => void;
}

function Login(props: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "store" | "admin">(
    "customer"
  );

  const navigate = useNavigate();
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let urlExists: string;
    let urlId: string;
    switch (userType) {
      case "customer":
        urlExists = Domains.CheckCustomer();
        urlId = Domains.CheckCustomerId(email);
        break;
      case "store":
        urlExists = Domains.CheckStore();
        urlId = Domains.CheckStoreId(email);
        break;
      default:
        if (email === "admin" && password === "admin") {
          localStorage.setItem(EMAIL, email);
          localStorage.setItem(PASSWORD, password);
          localStorage.setItem(ROLE, userType);

          navigate("/");
          props.setLoggedUser(email);
          return;
        } else {
          window.alert("Invalid email or password!");
          return;
        }
    }

    // call server to check USER
    const response = axios
      .post(urlExists, { email: email, password: password })
      .then((response) => {
        const exists = response.data;
        if (exists) {
          // if the users exists, then login him in
          localStorage.setItem(EMAIL, email);
          localStorage.setItem(PASSWORD, password);
          localStorage.setItem(ROLE, userType);

          axios
            .get(urlId)
            .then((response) => {
              localStorage.setItem(ID, response.data);
            })
            .catch(() => {
              alert("Problem fetching user's id");
            });

          navigate("/");
          props.setLoggedUser(email);
        } else {
          window.alert("Invalid email or password!");
        }
      })
      .catch((error) => {
        console.log("Problem connecting to the server: " + error);
        window.alert("Problem connecting to the server: " + error);
      });
  };

  function handleCancelButton() {
    navigate("/");
  }

  return (
    <div className="container" style={{ marginBottom: "50px" }}>
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-light text-dark">
              <h4>Login</h4>
              <img src={image} />
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userType" className="form-label">
                    User Type
                  </label>
                  <select
                    className="form-select"
                    id="userType"
                    value={userType}
                    onChange={(event) =>
                      setUserType(
                        event.target.value as "customer" | "store" | "admin"
                      )
                    }
                    required
                  >
                    <option value="customer">Customer</option>
                    <option value="store">Store</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="d-flex">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginRight: "5px" }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
function updateHeader(arg0: {
  email: string;
  password: string;
  role: "customer" | "store" | "admin";
}) {
  throw new Error("Function not implemented.");
}
