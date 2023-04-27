import { Link } from "react-router-dom";
import Helpers from "../Config/Helpers";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import NavLink from "../Components/NavLink";

function Navbar() {
  let navigate = useNavigate();

  const [tabs, setTabs] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const handleLogout = () => {
    localStorage.clear();
    Helpers.toast("success", "Logged out successfully");
    navigate("/");
  };

  const canSee = (tab_link) =>{
      for (let i = 0; i < permissions.length; i++) {
        if (permissions[i].tab_link === tab_link) {
            return true
        }
      }

      return false;
  }

  const getTabs = () => {
    axios.get(`${Helpers.baseUrl}tabs`, Helpers.headers).then((response) => {
      setTabs(response.data);
    });
  };

  const getPermissions = () => {
    let permissions = localStorage.getItem("permissions");
    permissions = JSON.parse(permissions);
    setPermissions(permissions);
  };

  useEffect(() => {
    getPermissions();
    getTabs();
  }, []);

  return (
    <div className="app-menu navbar-menu" style={{ width: 275 }}>
      <div className="navbar-brand-box">
        <Link to="/" className="logo logo-dark">
          <span className="logo-sm">
            <img src="/images/logo-sm.png" alt="" height="22" />
          </span>
          <span className="logo-lg">
            <img src="/images/logo-dark.png" alt="" height="17" />
          </span>
        </Link>
        <Link to="/" className="logo logo-light">
          <span className="logo-sm">
            <img src="/images/logo-sm.png" alt="" height="22" />
          </span>
          <span className="logo-lg">
            <img src="/images/logo-light.png" alt="" height="17" />
          </span>
        </Link>
        <button
          type="button"
          className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
          id="vertical-hover"
        >
          <i className="ri-record-circle-line"></i>
        </button>
      </div>

      <div id="scrollbar" style={{ overflowY: "auto", height: "100%" }}>
        <div className="container-fluid">
          <div id="two-column-menu"></div>
          {Helpers.authUser.user_role == null ? (
            <ul className="navbar-nav" id="navbar-nav">
                <li className="menu-title">
                    <span data-key="t-menu">Menu</span>
                </li>
                {tabs.map(tab => {
                    return <NavLink key={tab._id} icon={tab.tab_icon} link={tab.tab_link} text={tab.tab_name} />
                })}
                <NavLink icon="profile.png" link="/user/profile-settings" text="Profile Settings" />
                <li className="nav-item">
                    <a
                    href="#!"
                    className="nav-link menu-link"
                    onClick={handleLogout}
                    >
                    <img
                        src="/images/icons/power.png"
                        alt="home"
                        style={{ height: 15, marginRight: 10 }}
                    />
                    <span data-key="t-widgets">Logout</span>
                    </a>
                </li>
            </ul>
          ) : (
            <ul className="navbar-nav" id="navbar-nav">
              <li className="menu-title">
                <span data-key="t-menu">Menu</span>
              </li>
              {tabs.map(tab => {
                return canSee(tab.tab_link) ? (
                    <li className="nav-item" key={tab._id}>
                      <Link className="nav-link menu-link" to={tab.tab_link}>
                        <img
                          src={`/images/icons/${tab.tab_icon}`}
                          alt="home"
                          style={{ height: 20, marginRight: 10 }}
                        />
                        <span data-key="t-widgets">{tab.tab_name}</span>
                      </Link>
                    </li>
                  ) : null;
              })}
              <NavLink icon="profile.png" link="/user/profile-settings" text="Profile Settings" />
              <li className="nav-item">
                <a
                  href="#!"
                  className="nav-link menu-link"
                  onClick={handleLogout}
                >
                  <img
                    src="/images/icons/power.png"
                    alt="home"
                    style={{ height: 20, marginRight: 10 }}
                  />
                  <span data-key="t-widgets">Logout</span>
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="sidebar-background"></div>
    </div>
  );
}

export default Navbar;
