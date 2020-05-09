import React from "react";
import { NavLink } from "react-router-dom";
import "./Nav.css";

function Nav() {
  return (
    <header>
      <NavLink className="title" exact to="/">
        BasicML
      </NavLink>
      <nav>
        <ul className="nav__links">
          <li>
            <NavLink exact to="/graddesc">
              Gradient Descent
            </NavLink>
          </li>
          <li>
            <NavLink exact to="/linreg">
              Linear Regression
            </NavLink>
          </li>
          <li>
            <NavLink exact to="/contact">
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Nav;
