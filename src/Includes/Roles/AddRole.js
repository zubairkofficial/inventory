import { useState, forwardRef, useImperativeHandle } from "react";
import Helpers from "../../Config/Helpers";
import axios from "axios";
import Button from "../../Components/Button";
import Input from "../../Components/Input";

const AddRole = forwardRef(({ getRoles }, ref) => {
    let roleInit = {
        name: "",
        user_id: Helpers.authParentId,
    };
    const [isEditing, setIsEditing] = useState(false);
    const [role, setRole] = useState(roleInit);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveRole = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const addOrUpdate = isEditing ? "update" : "add";
        axios.post(`${Helpers.baseUrl}roles/${addOrUpdate}`, role, Helpers.headers).then((response) => {
            getRoles();
            setRole(roleInit);
            setIsEditing(false);
            Helpers.toast("success", "Role saved successfully");
            setIsLoading(false);
            setErrors({});
          })
          .catch((error) => {
            setErrors(Helpers.error_response(error));
            setIsLoading(false);
          });
    };
    useImperativeHandle(ref, () => ({
        handleEdit(roleToEdit){
            setIsEditing(true);
            setRole(roleToEdit);
        }
    }));

    return (
        <div className="card">
            <div className="card-header">
                <h5>
                  {isEditing
                    ? `Updating "${role.name}"`
                    : "Add New Role"}
                </h5>
            </div>
            <div className="card-body border-bottom">
                <form>
                    <Input label={"Role Name"} placeholder={"Role Name"} error={errors.name} value={role.name} onChange={(e) =>
                        setRole({ ...role, name: e.target.value })
                    } />
                    <div className="row">
                        <div className="col-6">
                            <Button onClick={handleSaveRole} color={"success"} text={"Save Role"} isLoading={isLoading} topMartgin={false} />
                        </div>
                        {isEditing && 
                            <div className="col-6">
                                <Button onClick={() => {
                                    setRole(roleInit);
                                    setIsEditing(false);
                                }} color={"danger"} text={"Cancel"} topMartgin={false}
                                />
                            </div>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
})

export default AddRole;