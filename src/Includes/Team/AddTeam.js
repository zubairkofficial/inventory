import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Input from "../../Components/Input";
import Helpers from "../../Config/Helpers";
import Button from "../../Components/Button";
import axios from "axios";
import ReactSelect from "../../Components/ReactSelect";
import { useNavigate } from "react-router-dom";

const AddTeamMember = forwardRef(({ getTeams }, ref) => {
    let navigate = useNavigate();

    let teamInit = {
        name: "",
        email: "",
        password: "",
        parent_id: Helpers.authParentId,
        user_role: null,
    };
    const [team, setTeam] = useState(teamInit);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState([]);
    const [rolesOptions, setRolesOptions] = useState([]);

    const handleSaveTeam = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const addOrUpdate = isEditing ? "update" : "add";
        axios.post(`${Helpers.baseUrl}teams/${addOrUpdate}`, team, Helpers.headers).then((response) => {
            setTeam(teamInit);
            setIsEditing(false);
            setSelectedRole("");
            getTeams();
            Helpers.toast("success", "Team saved successfully");
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
            Helpers.toast("error", error.response.data.message);
            setErrors(Helpers.error_response(error));
        });
    };

    const getRoles = () => {
        axios.get(`${Helpers.baseUrl}roles/all/${Helpers.authParentId}`, Helpers.headers).then((response) => {
            let roleArray = [];
            for (let index = 0; index < response.data.length; index++) {
              const object = {
                label: response.data[index].name,
                value: response.data[index],
              };
              roleArray.push(object);
            }
            setRolesOptions(roleArray);
        }).catch((error) => {
            Helpers.unauthenticated(error, navigate);
        });
    };
      
    useImperativeHandle(ref, () => ({
        handleEdit(teamToEdit){
            setIsEditing(true);
            setSelectedRole({
                label: teamToEdit.user_role.name,
                value: teamToEdit.user_role,
            });
            setTeam(teamToEdit);
        }
    }));

    const cancelSaving = () => {
        setIsEditing(false);
        setSelectedRole({});
        setTeam(teamInit);
    }
    const handleSelectRole = (selectedRole) => {
        setSelectedRole(selectedRole);
        setTeam({ ...team, user_role: selectedRole.value });
    };

    useEffect(() => {
        getRoles();
    }, []);

    return (
        <div className="card">
            <div className="card-header">
                <h5>
                    {isEditing
                    ? `Updating "${team.name}"`
                    : "Add New Team Member"}
                </h5>
            </div>
            <div className="card-body border-bottom">
                <Input label={"Name"} value={team.name} placeholder={"Name"} error={errors.name} onChange={e => {
                    setTeam({ ...team, name: e.target.value })
                }} />
                <Input label={"Email"} value={team.email} placeholder={"Email"} error={errors.email} onChange={e => {
                    setTeam({ ...team, email: e.target.value })
                }} />
                <Input label={"Password"} value={team.password} placeholder={"Password"} error={errors.password} onChange={e => {
                    setTeam({ ...team, password: e.target.value })
                }} />
                <ReactSelect label={"Select Role"} options={rolesOptions} value={selectedRole} onChange={handleSelectRole} />
                <div className="row">
                    <div className="col-6">
                        <Button text={"Save Member"} color={"success"} onClick={handleSaveTeam} fullWidth={true} isLoading={isLoading} />
                    </div>
                    {isEditing && <div className="col-6">
                        <Button text={"Cancel"} color={"danger"} onClick={cancelSaving} fullWidth={true} />
                    </div>}
                </div>
            </div>
        </div>
    );
})

export default AddTeamMember;