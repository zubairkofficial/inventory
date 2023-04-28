import { useState, forwardRef, useImperativeHandle } from "react";
import Helpers from "../../Config/Helpers";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import axios from "axios";

const AddEmployee = forwardRef(({ getEmployees }, ref) => {
    let employeeInit = {
        name: "",
        email: "",
        phone: "",
        user_id:Helpers.authParentId,
    };
    const [isEditing, setIsEditing] = useState(false);
    const [employee, setEmployee] = useState(employeeInit);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveEmployee = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const addOrUpdate = isEditing ? "update" : "add";
        axios.post(`${Helpers.baseUrl}employees/${addOrUpdate}`,employee,Helpers.headers).then((response) => {
            getEmployees();
            setEmployee(employeeInit);
            setIsEditing(false);
            Helpers.toast("success", "Employee saved successfully");
            setIsLoading(false);
        }).catch((error) => {
            setErrors(Helpers.error_response(error));
            setIsLoading(false);
        });
    };

    useImperativeHandle(ref, () => ({
        handleEdit(empToEdit){
            setIsEditing(true);
            setEmployee(empToEdit);
        }
    }));
    
    const cancelSaving = () => {
        setIsEditing(false);
        setEmployee(employeeInit);
    }

    return (
        <div className="card">
            <div className="card-header">
                  <h5>
                    {isEditing
                      ? `Updating "${employee.name}"`
                      : "Add New Employee"}
                  </h5>
            </div>
            <div className="card-body border-bottom">
                <form>
                    <Input value={employee.name} label={"Name"} placeholder={"Name"} error={errors.name} onChange={(e) =>
                          setEmployee({ ...employee, name: e.target.value })
                    } />
                    <Input value={employee.email} label={"Email"} placeholder={"Email"} error={errors.email} onChange={(e) =>
                          setEmployee({ ...employee, email: e.target.value })
                    } />
                    <Input value={employee.phone} label={"Phone"} placeholder={"Phone"} error={errors.phone} onChange={(e) =>
                          setEmployee({ ...employee, phone: e.target.value })
                    } />
                    <div className="row">
                        <div className="col-6">
                            <Button text={"Save Employee"} color={"success"} onClick={handleSaveEmployee} fullWidth={true} isLoading={isLoading} />
                        </div>
                        {isEditing && <div className="col-6">
                            <Button text={"Cancel"} color={"danger"} onClick={cancelSaving} fullWidth={true} />
                        </div>}
                    </div>
                </form>
            </div>
        </div>
    )
});

export default AddEmployee;