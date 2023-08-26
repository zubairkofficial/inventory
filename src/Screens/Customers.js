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
import { useTitle } from "../Hooks/useTitle";
import AddTax from "../Includes/Customer/AddTax";
import Pagination from "../Components/Pagination";

export default function Customers(){
    const permissions = usePermissions();
    const addCustomerRef = useRef(null);
    useTitle("Customers");

    const [customers, setCustomers] = useState([]);
    const [paginated, setPaginated] = useState([]);
    const [pageNo, setPageNo] = useState(0);
    const [data, setData] = useState([]);
    const [perms, setPerms] = useState([]);

    let navigate = useNavigate();

    const getCustomers = () => {
        axios
          .get(`${Helpers.baseUrl}customers/all/${Helpers.authParentId}`, Helpers.headers)
          .then((response) => {
                let data = response.data.reverse();
                setCustomers(data);
                setData(data);
                setPaginated(Helpers.paginate(data));
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
                                <CardHeader title={"All Customers"} paginate={true} setState={setPaginated} setPageNo={setPageNo} data={data} fields={["name", "company_name", "phone", "email", "address"]} />
                                <DataTable
                                    columns={[
                                        "Sr. #",
                                        "Customer Name",
                                        "Company Name",
                                        "Email",
                                        "Phone",
                                        "Address",
                                        "Taxable",
                                        "Actions",
                                    ]}
                                >
                                {paginated.length > 0 && paginated[pageNo].map((customer, index) => {
                                    return (
                                        <tr key={customer._id}>
                                            <td>{ (pageNo * 10) + (index + 1) }</td>
                                            <td>{customer.name}</td>
                                            <td>{customer.company_name}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.phone}</td>
                                            <td>{customer.address}</td>
                                            <td>{customer.tax}</td>
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
                                <Pagination paginated={paginated} pageNo={pageNo} setPageNo={setPageNo} />
                                {customers.length === 0 ?<div className="text-center">
                                No data available to display
                                </div> : null}
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        {Helpers.authUser.user_role == null || perms.can_create === 1 || (parseInt(perms.can_update) === 1) ? 
                            <>
                                <AddCustomer allCustomers={getCustomers} ref={addCustomerRef} />
                                <AddTax />
                            </>
                        : null}
                    </div>
                </div>
            </div>
        </div>
    )
}