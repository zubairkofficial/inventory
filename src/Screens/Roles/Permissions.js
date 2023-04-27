import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import "izitoast-react/dist/iziToast.css";
import Helpers from "../../Config/Helpers";
import PageTitle from "../../Components/PageTitle";
import Button from "../../Components/Button";
import TabPermission from "../../Includes/Roles/TabPermission";
import { useTitle } from "../../Hooks/useTitle";

function Permissions() {
  let checkedInit = {
    checked_tabs: [],
    checked_pers: [],
  };
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(checkedInit);
  const [tabs, setTabs] = useState([]);
  const {role_id, role_name} = useParams();
  useTitle(`${role_name} Permissions`);
  let navigate = useNavigate();
  const getPermissions = () => {
    axios.get(`${Helpers.baseUrl}permissions/get-permissions/${role_id}`, Helpers.headers).then((response) => {
        let pers = response.data;
        let check = {
          role_id : role_id,
          checked_tabs: [],
          checked_pers: [],
        };
        for (let i = 0; i < pers.length; i++) {
            check.checked_tabs.push(pers[i].tab_link);
            if (parseInt(pers[i].can_create) === 1) {
              check.checked_pers.push(`${pers[i].tab_link}-add`);
            }
            if (parseInt(pers[i].can_update) === 1) {
              check.checked_pers.push(`${pers[i].tab_link}-update`);
            }
            if (parseInt(pers[i].can_delete) === 1) {
              check.checked_pers.push(`${pers[i].tab_link}-delete`);
            }         
        }

        setChecked(check);
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };

  const getTabs = () => {
    axios.get(`${Helpers.baseUrl}tabs`, Helpers.headers).then((response) => {
      setTabs(response.data);
    });
  };
  const handleSavePermission = (e) => {
    e.preventDefault();
    setIsLoading(true);


    axios.post(`${Helpers.baseUrl}permissions/save`, checked, Helpers.headers).then((response) => {
        getPermissions();
        Helpers.toast("success", "Permission saved successfully");
        navigate("/user/roles");
        setIsLoading(false);
    }).catch((error) => {
        Helpers.toast("error", error.response.data.message);
        setIsLoading(false);
    });
  };

  const handleCheck = (e) =>{
    const tab_link = e.target.value;
    const checked_tabs = checked.checked_tabs;
    const checked_pers = checked.checked_pers;
    if (checked_tabs.includes(tab_link)) {
      const index = checked_tabs.findIndex(tab => tab === tab_link);
      checked_tabs.splice(index, 1);
      if (checked_pers.includes(tab_link+'-add')) {
        const index = checked_pers.findIndex(per => per === tab_link+'-add');
        checked_pers.splice(index, 1); 
      }
      if (checked_pers.includes(tab_link+'-update')) {
        const index = checked_pers.findIndex(per => per === tab_link+'-update');
        checked_pers.splice(index, 1);
      }
      if (checked_pers.includes(tab_link+'-delete')) {
        const index = checked_pers.findIndex(per => per === tab_link+'-delete');
        checked_pers.splice(index, 1);
      }

      setChecked({...checked, checked_tabs:checked_tabs, checked_pers:checked_pers});

    }else{
      checked_tabs.push(tab_link);
      setChecked({...checked, checked_tabs:checked_tabs});
    }

  }

  const handleCheckPers = (e) =>{
    const tab_per = e.target.value;
    console.log(tab_per);
    const checked_pers = checked.checked_pers;
    if (checked_pers.includes(tab_per)) {
      const index = checked_pers.findIndex(tab => tab === tab_per);
      checked_pers.splice(index, 1);
      setChecked({...checked, checked_pers:checked_pers});

    }else{
      checked_pers.push(tab_per);
      setChecked({...checked, checked_pers:checked_pers});
    }

    console.log(checked);
  }

  useEffect(() => {
    getTabs();
    getPermissions();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="page-content">
        <div className="container-fluid">
            <PageTitle title={`Manage Permissions for ${role_name}`} />
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <div className=" row">
                                <div className="col-6">
                                    <h3>
                                        <img
                                            src="/images/icons/permissions.png"
                                            alt="home"
                                            style={{ height: 30, marginRight: 10 }}
                                        />{" "}
                                        Manage Permissions for {role_name}
                                    </h3>
                                </div>
                                <div className="col-6 text-end">
                                    <Link to={`/user/roles`} className="btn btn-success text-end">Back to Roles</Link>
                                </div>
                            </div>
                        </div>
                        <div className="card-body border-bottom">
                            <div className="row">
                            {tabs.map((tab)=>{
                                return(
                                <div className="col-4" key={tab._id}>
                                    <TabPermission tab={tab} checked={checked} handleCheck={handleCheck} handleCheckPers={handleCheckPers} />
                                </div>
                                )
                            })}
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <Button text={`Save Permissions for ${role_name}`} color={"success"} fullWidth={false} topMartgin={false} isLoading={isLoading} onClick={handleSavePermission} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Permissions;
