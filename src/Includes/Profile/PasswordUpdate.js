import { useState } from "react";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import axios from "axios";
import Helpers from "../../Config/Helpers";

export default function PasswordUpdate(){
    let passwordInit = {
        new_password: "",
        password_confirmation: "",
    };
    const [password, setPassword] = useState(passwordInit);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSavePassword = (e) => {
        e.preventDefault();
        setIsLoading(true);
        let data = password;
        data._id = Helpers.authUser._id;
        // setPassword({ ...password, _id: Helpers.authUser._id });
        axios.post(`${Helpers.baseUrl}users/update-password`, data, Helpers.headers).then((response) => {
            setPassword(passwordInit);
            Helpers.toast("success", "Password Updated successfully");
            setIsLoading(false);
            setErrors({});
        }).catch((error) => {
            Helpers.toast("error", error.response.data.message);
            setErrors(Helpers.error_response(error));
            setIsLoading(false);
        });
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5>
                    <img src="/images/icons/change-password.png" alt="home" style={{height:30, marginRight:10}} />
                    Update Password
                </h5>
            </div>
            <div className="card-body border-bottom">
                <form>
                    <Input type="password" value={password.new_password} error={errors.new_password} label={"New Password"} placeholder={"New Password"} onChange={(e) =>
                        setPassword({ ...password, new_password: e.target.value })
                    } />
                    <Input type="password" value={password.password_confirmation} error={errors.password_confirmation} label={"Confirm New Password"} placeholder={"Confirm New Password"} onChange={(e) =>
                        setPassword({ ...password, password_confirmation: e.target.value })
                    } />
                    <Button text={"Update Password"} isLoading={isLoading} onClick={handleSavePassword} color={"success"} fullWidth={false} />
                </form>
            </div>
        </div>
    );
}