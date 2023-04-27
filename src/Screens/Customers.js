import { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "../Components/Datatable";
import PageTitle from "../Components/PageTitle";
import Helpers from "../Config/Helpers";
import { Link, useNavigate } from "react-router-dom";
import { usePermissions } from "../Hooks/usePermissions";
import AddCustomer from "../Includes/Customer/AddCustomer";
import ActionButton from "../Components/ActionButton";
import CardHeader from "../Components/CardHeader";

export default function Customers(){
    const permissions = usePermissions();
    const addCustomerRef = useRef(null);

    const [customers, setCustomers] = useState([]);
    const [data, setData] = useState([]);
    const [perms, setPerms] = useState([]);
    
    let navigate = useNavigate();

    const getCustomers = () => {
        axios
          .get(`${Helpers.baseUrl}customers/all/${Helpers.authParentId}`, Helpers.headers)
          .then((response) => {
              setCustomers(response.data.reverse());
              setData(response.data);
          })
          .catch((error) => {
            Helpers.unauthenticated(error, navigate);
          });
    };

    useEffect(() => {
        getCustomers();
        setPerms(permissions);
        // eslint-disable-next-line
    }, []);

    const hanldeEdit = (customerToEdit) => {
        addCustomerRef.current.handleEdit(customerToEdit);
    };
    
    const handleDelete = (customerId) => {
        Helpers.confirmBox(`${Helpers.baseUrl}customers/delete/${customerId}`, navigate, getCustomers)
    };

    return (
        <div className="page-content">
            <div className="container-fluid">
                <PageTitle title={"All Customers"} />
                <div className="row">
                    <div className="col-8">
                        <div className="card">
                            <div className="card-body border-bottom">
                                <CardHeader title={"All Customers"} setState={setCustomers} data={data} fields={["name", "phone"]} />
                                <DataTable
                                columns={[
                                    "Sr. #",
                                    "Customer Name",
                                    "Company Name",
                                    "Email",
                                    "Phone",
                                    "Address",
                                    "Actions",
                                ]}
                                >
                                {customers.map((customer, index) => {
                                    return (
                                    <tr key={customer._id}>
                                        <td>{index + 1}</td>
                                        <td>{customer.name}</td>
                                        <td>{customer.company_name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                        <td>{customer.address}</td>
                                        <td>
                                            <Link
                                                to={`/user/receipts/customer/${customer.name}/${customer._id}`}
                                                className="btn btn-warning btn-sm m-1"
                                            >
                                                <ion-icon name="eye-outline"></ion-icon>
                                            </Link>

                                        {
                                            (Helpers.authUser.user_role == null || parseInt(perms.can_update) === 1) &&
                                            <ActionButton icon={"create-outline"} color={"success"} onClick={() => hanldeEdit(customer)} />
                                        }
                                        {
                                            (Helpers.authUser.user_role == null || parseInt(perms.can_delete) === 1) &&
                                            <ActionButton icon={"trash-outline"} color={"danger"} onClick={() => handleDelete(customer._id)} />
                                        }
                                        </td>
                                    </tr>
                                    );
                                })}
                                </DataTable>
                                {customers.length === 0 ?<div className="text-center">
                                No data available to display
                                </div> : null}
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        {Helpers.authUser.user_role == null || parseInt(perms.can_create) === 1 || (parseInt(perms.can_update) === 1) ? 
                            <AddCustomer allCustomers={getCustomers} ref={addCustomerRef} />
                        : null}
                    </div>
                </div>
            </div>
        </div>
    )
}