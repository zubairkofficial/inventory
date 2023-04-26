import PageTitle from "../Components/PageTitle";
import ProfileInfo from "../Includes/Profile/ProfileInfo";
import PasswordUpdate from "../Includes/Profile/PasswordUpdate";

function ProfileSettings() {
  return (
    <div className="page-content">
        <div className="container-fluid">
            <PageTitle title={"Profile Settings"} />
            <div className="row">
                <div className="col-6">
                    <ProfileInfo />
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
