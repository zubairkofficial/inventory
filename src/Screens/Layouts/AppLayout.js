import { Outlet } from "react-router-dom";
import Header from "../../Includes/Header";
import Navbar from "../../Includes/Navbar";
import Footer from "../../Includes/Footer";

export default function Layout(){
    return (
        <div id="layout-wrapper">
            <Header/>
            <Navbar/>
            <div className="vertical-overlay"></div>
            <div className="main-content" style={{ marginLeft: 275 }}>
                <Outlet/>
                <Footer/>
            </div>
        </div>
    );
}