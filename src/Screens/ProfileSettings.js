import PageTitle from "../Components/PageTitle";
import ProfileInfo from "../Includes/Profile/ProfileInfo";
import PasswordUpdate from "../Includes/Profile/PasswordUpdate";
import { useTitle } from "../Hooks/useTitle";
import Button from "../Components/Button";
import axios from "axios";
import { useState } from "react";
import Helpers from "../Config/Helpers";

function ProfileSettings() {
    useTitle("Profile Settings");

    const [selectedFile, setSelectedFile] = useState(null);
    const [imgSrc, setImageSrc] = useState(Helpers.authUser.profile);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        let file = event.target.files[0];
        setSelectedFile(file);
        setImageSrc(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);


        if (!selectedFile) {
            console.error("No image selected.");
            setIsLoading(false);
            return;
        }
        
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("user_id", Helpers.authUser._id);
        axios.post(`${Helpers.baseUrl}users/upload`, formData, Helpers.imageHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setIsLoading(false);
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000);
        }).catch(error => {
            Helpers.toast("error", "Error uploading image");
            setIsLoading(true);
        })
    };

  return (
    <div className="page-content">
        <div className="container-fluid">
            <PageTitle title={"Profile Settings"} />
            <div className="row">
                <div className="col-6">
                    <ProfileInfo />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>
                                        <img src="/images/icons/profile.png" alt="home" style={{height:30, marginRight:10}} />
                                        Update Picture
                                    </h5>
                                </div>
                                <div className="card-body border-bottom">
                                    {selectedFile && <img src={imgSrc} className="preview" alt="" />}
                                    {!selectedFile && <img src={`${Helpers.baseUrl}uploads/${imgSrc}`} className="preview" alt="" />}
                                    <form>
                                        <div className="form-group">
                                            <label>Profile Picture</label>
                                            <input className="form-control" onChange={handleFileChange} type="file" />
                                        </div>
                                        <Button text={"Upload"} isLoading={isLoading} onClick={handleSubmit} color={"success"} fullWidth={false} />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <PasswordUpdate />
                </div>
            </div>
        </div>
    </div>
  );
}

export default ProfileSettings;
