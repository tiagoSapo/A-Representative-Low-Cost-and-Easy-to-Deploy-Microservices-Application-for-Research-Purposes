import React, { ComponentProps, useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import miniLogo from "../assets/favicon.ico";
import { EMAIL, ID, PASSWORD, ROLE } from "../utils/AuthKeys";
import { IAuthChange } from "../utils/Interfaces";

interface LoginProps {
  loggedUser: string | null;
  setLoggedUser: (isLoggedIn: string | null) => void;
}

function Header(props: LoginProps) {
  const [email, setEmail] = useState(localStorage.getItem(EMAIL));
  const [password, setPassword] = useState(localStorage.getItem(PASSWORD));
  const [role, setRole] = useState(localStorage.getItem(ROLE));

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem(ID); // remove user's id
    localStorage.removeItem(EMAIL);
    localStorage.removeItem(PASSWORD);
    localStorage.removeItem(ROLE);

    setEmail(null);
    setPassword(null);
    setRole(null);

    props.setLoggedUser(null);
    navigate("/");
  }

  function handleGoToAccount(): void {
    const currentRole = localStorage.getItem(ROLE);

    console.log("hello " + currentRole);
    switch (currentRole) {
      case "customer":
        navigate("customer");
        break;
      case "store":
        navigate("store");
        break;
      default:
        navigate("admin");
    }
  }

  return (
    <>
      <header>
        <Navbar bg="light" variant="light" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              <Image
                src={miniLogo}
                alt="Image"
                width="30"
                height="30"
                style={{ marginRight: "10px" }}
                fluid
              />
              Publicitaki
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/products">
                  All products
                </Nav.Link>
                <Nav.Link as={Link} to="/home-appliances">
                  Home appliances
                </Nav.Link>
                <Nav.Link as={Link} to="/computers">
                  Computers
                </Nav.Link>
                <NavDropdown title="Video-games" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/video-games/playstation">
                    PlayStation
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/video-games/xbox">
                    Xbox
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/video-games/nintendo">
                    Nintendo
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/video-games/">
                    All video-games
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav>
                {props.loggedUser ? (
                  <>
                    <Nav.Link onClick={handleGoToAccount}>
                      Hello {props.loggedUser}
                    </Nav.Link>
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/register">
                      Register
                    </Nav.Link>
                    <Nav.Link as={Link} to="/login">
                      Login
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
}

export default Header;
