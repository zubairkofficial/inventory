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
    const [showForm, setShowForm] = useState(false);
    const [showTax, setShowTax] = useState(false);

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
        setShowForm(true);
        addCustomerRef.current.handleEdit(customerToEdit);
    };
    
    const handleDelete = (customerId) => {
        Helpers.confirmBox(`${Helpers.baseUrl}customers/delete/${customerId}`, navigate, getCustomers)
    };

    const showCustomerForm = () => {
        setShowForm(true);
        setShowTax(false);
    }

    const showTaxForm = () => {
        setShowTax(true);
        setShowForm(false);
    }

    return (
        <div className="page-content">
            <div className="container-fluid">
                <PageTitle title={`All Customers - ${data.length}`}>
                    <div>
                        <button onClick={showCustomerForm} className="btn btn-success m-1">Add New Customer</button>
                        <button onClick={showTaxForm} className="btn btn-success m-1">Update Tax</button>
                    </div>
                </PageTitle>
                <div className="row">
                    <div className={ (showForm || showTax) ? 'col-8' : 'col-12' }>
                        <div className="card">
                            <div className="card-body border-bottom">
                                <CardHeader title={"All Customers"} paginate={true} setState={setPaginated} setPageNo={setPageNo} data={data} fields={["name", "company_name", "phone", "email", "address", "tax"]} />
                                <DataTable
                                    columns={(!showForm && !showTax) ? [
                                        "Sr. #",
                                        "Customer Name",
                                        "Company Name",
                                        "Email",
                                        "Phone",
                                        "Address",
                                        "Taxable",
                                        "Actions",
                                    ] : [
                                        "Sr. #",
                                        "Customer Name",
                                        "Phone",
                                    ]}
                                >
                                {paginated.length > 0 && paginated[pageNo].map((customer, index) => {
                                    return (
                                        <tr key={customer._id}>
                                            <td>{ (pageNo * 10) + (index + 1) }</td>
                                            <td>{customer.name}</td>
                                            {(!showForm && !showTax) && <td>{customer.company_name}</td>}
                                            {(!showForm && !showTax) && <td>{customer.email}</td>}
                                            <td>{customer.phone}</td>
                                            {(!showForm && !showTax) && <td>{customer.address}</td>}
                                            {(!showForm && !showTax) && <td>{customer.tax} { customer.taxValue > 0 && ` - ${customer.taxValue}%`  }</td>}
                                            {(!showForm && !showTax) && <td>
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
                                            </td>}
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
                    <div className="col-4" style={{ display: `${ showForm ? 'block' : 'none' }` }}>
                        {Helpers.authUser.user_role == null || perms.can_create === 1 || (parseInt(perms.can_update) === 1) ? 
                            <>
                                <AddCustomer setShowForm={setShowForm} allCustomers={getCustomers} ref={addCustomerRef} />
                            </>
                        : null}
                    </div>
                    <div className="col-4" style={{ display: `${ showTax ? 'block' : 'none' }` }}>
                        {Helpers.authUser.user_role == null || perms.can_create === 1 || (parseInt(perms.can_update) === 1) ? 
                            <>
                                <AddTax setShowTax={setShowTax} />
                            </>
                        : null}
                    </div>
                </div>
            </div>
        </div>
    )
}