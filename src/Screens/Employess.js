import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import { usePermissions } from "../Hooks/usePermissions";
import { useTitle } from "../Hooks/useTitle";
import AddEmployee from "../Includes/Employee/AddEmployee";
import axios from 'axios';
import Helpers from "../Config/Helpers";
import CardHeader from "../Components/CardHeader";
import DataTable from "../Components/Datatable";
import ActionButton from "../Components/ActionButton";

export default function Employees(){
    useTitle("Employees");
    const addEmpRef = useRef(null);
    const permissions = usePermissions();
    const [perms, setPerms] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [data, setData] = useState([]);
    let navigate = useNavigate();
    const getEmployees = () => {
        axios
          .get(`${Helpers.baseUrl}employees/all/${Helpers.authParentId}`, Helpers.headers)
          .then((response) => {
            setEmployees(response.data.reverse());
            setData(response.data);
          })
          .catch((error) => {
            Helpers.unauthenticated(error, navigate);
          });
    };

    const hanldeEdit = (empToEdit) => {
        addEmpRef.current.handleEdit(empToEdit);
    };
    
    const handleDelete = (employeeId) => {
        Helpers.confirmBox(`${Helpers.baseUrl}employees/delete/${employeeId}`, navigate, getEmployees)
    };

    useEffect(() => {
        getEmployees();
        setPerms(permissions);
        // eslint-disable-next-line
    }, []);
    return (
        <div className="page-content">
            <div className="container-fluid">
                <PageTitle title={"Employees"} />
                <div className="row">
                    <div className="col-8">
                        <div className="card">
                            <div className="card-body border-bottom">
                                <CardHeader setState={setEmployees} title={"All Employees"} data={data} fields={["name", "email", "phone"]} />
                                <DataTable
                                    columns={[
                                        "Sr. #",
                                        "Employee Name",
                                        "Email",
                                        "Phone",
                                        "Actions",
                                    ]}
                                >
                                    {employees.map((employee, index) => {
                                        return (
                                        <tr key={employee._id}>
                                            <td>{index + 1}</td>
                                            <td>{employee.name}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.phone}</td>
                                            <td>
                                            {
                                                (Helpers.authUser.user_role == null || parseInt(perms.can_update) === 1) &&
                                                <ActionButton icon={"create-outline"} color={"success"} onClick={() => hanldeEdit(employee)} />
                                            }
                                            {
                                                (Helpers.authUser.user_role == null || parseInt(perms.can_delete) === 1) && 
                                                <ActionButton icon={"trash-outline"} color={"danger"} onClick={() => handleDelete(employee._id)} />
                                            }
                                            </td>
                                        </tr>
                                        );
                                    })}
                                    </DataTable>
                                    {employees.length === 0 ?<div className="text-center">
                                    No data available to display
                                    </div> : null}
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        {
                            (Helpers.authUser.user_role == null || perms.can_create === 1 || parseInt(perms.can_update) === 1) && <AddEmployee getEmployees={getEmployees} ref={addEmpRef} />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}