
import React, { Component } from "react";
import styles from "./Navbar.module.scss";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faHouse,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";


export default class Navbar extends Component {
  handleSearchIconClick = () => {
    if (this.props.onSearchIconClick) {
      this.props.onSearchIconClick();
    }
  };

  render() {
    return (
      <nav className={styles.wrapper}>
        <div className={styles.contents}>
          <Link to="/search" onClick={this.handleSearchIconClick}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" color="white" />
          </Link>
          <Link to="/">
            <FontAwesomeIcon icon={faHouse} size="lg" color="white" />
          </Link>
          <Link to="/">
            <FontAwesomeIcon icon={faHeart} size="lg" color="white" />
          </Link>
        </div>
      </nav>
    );
  }
}

