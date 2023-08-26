import Helpers from "../Config/Helpers";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Header(){ 
  let navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        Helpers.toast("success", "Logged out successfully");
        navigate('/');
    }
    return (
        <header id="page-topbar">
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex"></div>
            <div className="d-flex align-items-center">
                <Link className="btn btn-success m-1" to="/user/receipts/add"><i className="fa fa-plus"></i> Add Receipt</Link>
                <div className="dropdown ms-sm-3 header-item topbar-user">
                    <button type="button" className="btn shadow-none" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="d-flex align-items-center">
                            <img className="rounded-circle header-profile-user" src="/images/profile.webp" alt="Header Avatar" />
                            <span className="text-start ms-xl-2">
                                <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{Helpers.authUser.name}</span>
                            </span>
                        </span>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end">
                        <h6 className="dropdown-header">Welcome {Helpers.authUser.name}!</h6>
                        <Link to={`/user/profile-settings`} className="dropdown-item"><i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Profile Settings</span></Link>
                        <button className="dropdown-item" onClick={handleLogout}><i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span className="align-middle" data-key="t-logout">Logout</span></button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </header>
    );
}
export default Header;