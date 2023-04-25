import { useState } from "react";
import { useTitle } from "../../Hooks/useTitle"
import Helpers from "../../Config/Helpers";
import axios from "axios";
import { Link } from "react-router-dom";
import Input from "../../Components/Input";
import Button from "../../Components/Button";

export default function Login(){
    useTitle("Login");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const hanldeLogin = async (e) => {
        e.preventDefault();
        axios.post(`${Helpers.baseUrl}users/login-user`, formData).then(response => {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('timestamp', new Date().getTime());
            localStorage.setItem('permissions', JSON.stringify(response.data.permissions));
            Helpers.toast("success", "Logged In successfully");
            window.location.href = "/user/dashboard";
        }).catch(error => {
            setErrors(Helpers.error_response(error));
        });
    };
    return (
        <div className="auth-page-wrapper pt-5">
            <div className="auth-one-bg-position auth-one-bg" id="auth-particles"></div>
            <div className="auth-page-content">
                <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                    <div className="text-center mt-sm-5 mb-4 text-white-50">
                        <div>
                            <Link to="/" className="d-inline-block auth-logo">
                                <img
                                src="/images/logo-light.png"
                                alt=""
                                height="20"
                                />
                            </Link>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                    <div className="card mt-4">
                        <div className="card-body p-4">
                        <div className="text-center mt-2">
                            <h5 className="text-primary">Welcome Back !</h5>
                            <p className="text-muted">
                                Sign in to continue to {Helpers.appName}.
                            </p>
                        </div>
                        <div className="p-2 mt-4">
                            <form>
                                <Input label="Email" value={formData.email} placeholder="Enter Email" error={errors.email} onChange={e => {
                                    setFormData({ ...formData, email: e.target.value });
                                }} />
                                <Input label="Password" value={formData.password} type="password" placeholder="Enter Password" error={errors.password} onChange={e => {
                                    setFormData({ ...formData, password: e.target.value });
                                }} />
                                <Button text="Login" color="success" onClick={hanldeLogin} />
                            </form>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <footer className="footer">
                <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                    <div className="text-center">
                        <p className="mb-0 text-muted">
                        &copy; {Helpers.appName}. Created By{" "}
                        <a href="https://cyberify.co">Cyberify</a>.
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </footer>
        </div>
    )
}