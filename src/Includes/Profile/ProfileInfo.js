import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../Config/Helpers";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { useNavigate } from "react-router-dom";

export default function ProfileInfo(){
    let userInit = {
        name: "",
        email: "",
    };
    const [user, setUser] = useState(userInit);
    const [btnLoading, setBtnLoading] = useState(false);
    const [errors, setErrors] = useState({});
    let navigate = useNavigate();
    const getUser = () => {
        axios.get(`${Helpers.baseUrl}users/get-profile/${Helpers.authUser._id}`,Helpers.headers).then((response) => {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        }).catch((error) => {
            Helpers.unauthenticated(error, navigate);
        });
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setBtnLoading(true);
        axios.post(`${Helpers.baseUrl}users/update-profile`, user, Helpers.headers).then((response) => {
            getUser();
            Helpers.toast("success", "Profile Updated successfully");
            setBtnLoading(false);
        }).catch((error) => {
            Helpers.toast("error", error.response.data.message);
            setErrors(Helpers.error_response(error));
            setBtnLoading(false);
        });
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="card">
            <div className="card-header">
                <h5>
                    <img src="/images/icons/profile.png" alt="home" style={{height:30, marginRight:10}} />
                    Update Profile
                </h5>
            </div>
            <div className="card-body border-bottom">
                <form>
                    <Input label={"Name"} placeholder={"Your Name"} value={user.name} error={errors.name} onChange={e => {
                        setUser({...user, name: e.target.value})
                    }} />
                    <Input label={"Email"} placeholder={"Your Email"} value={user.email} error={errors.email} onChange={e => {
                        setUser({...user, email: e.target.value})
                    }} />
                    <Button text={"Save Profile"} isLoading={btnLoading} onClick={handleSaveProfile} color={"success"} fullWidth={false} />
                </form>
            </div>
        </div>
    )
}