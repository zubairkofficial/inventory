import { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "../../Components/Datatable";
import PageTitle from "../../Components/PageTitle";
import Helpers from "../../Config/Helpers";
import { Link, useNavigate } from "react-router-dom";
import { usePermissions } from "../../Hooks/usePermissions";
import ActionButton from "../../Components/ActionButton";
import CardHeader from "../../Components/CardHeader";
import { useTitle } from "../../Hooks/useTitle";
import moment from "moment";

export default function TodayReceipts() {
    useTitle("Today Receipts");
    let navigate = useNavigate();

    const permissions = usePermissions();
    const [perms, setPerms] = useState([]);

    const [receipts, setReceipts] = useState([]);
    const [data, setData] = useState([]);

    const getTodayReceipts = () => {
        let date = Helpers.currentDate();
        axios
          .get(`${Helpers.baseUrl}receipts/today/${date}/${Helpers.authParentId}`, Helpers.headers)
          .then((response) => {
              setReceipts(response.data.reverse());
              setData(response.data);
          })
          .catch((error) => {
            Helpers.unauthenticated(error, navigate);
          });
    };

    const handleDelete = (receiptId) => {
        Helpers.confirmBox(`${Helpers.baseUrl}receipts/delete/${receiptId}`, navigate, getTodayReceipts)
    };

    useEffect(() => {
        getTodayReceipts();
        setPerms(permissions);
        // eslint-disable-next-line
    }, []);

    return (
        <div className="page-content">
            <div className="container-fluid">
                <PageTitle title={"Today Receipts"} 
                    children={<div>
                        <Link className="btn btn-light m-1" to="/user/receipts">All Receipts</Link>
                    </div>} 
                />
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body border-bottom">
                                <CardHeader title={"Today Receipts"} setState={setReceipts} data={data} fields={["customer.name", "vehicle.name", "vehicle.model", "totalPrice", "paid", "remaining", "status"]} />
                                <DataTable
                                columns={[
                                    "Sr. #",
                                    "Customer",
                                    "Vehicle",
                                    "Total Price",
                                    "Amount Paid",
                                    "Amount Remaining",
                                    "Payment Status",
                                    "Date",
                                    "Actions",
                                ]}
                                >
                                {receipts.map((receipt, index) => {
                                    return (
                                    <tr key={receipt._id}>
                                        <td>{index + 1}</td>
                                        <td>{receipt.customer ? receipt.customer.name : ''}</td>
                                        <td>{receipt.vehicle ? receipt.vehicle.name+' '+receipt.vehicle.model : ''}</td>
                                        <td>$ {receipt.totalPrice}</td>
                                        <td>$ {receipt.paid}</td>
                                        <td>$ {receipt.remaining}</td>
                                        <td>{receipt.status}</td>
                                        <td>{moment(receipt.created_date).format("MMM DD, YY hh:mm A")}</td>
                                        <td>
                                            {
                                                receipt.status != 'Paid' && (parseInt(perms.can_update) === 1 || Helpers.authUser.user_role == null ) ?
                                                <Link className="btn btn-warning btn-sm m-1" to={`/user/unpaid-receipt/make-payment/${receipt._id}`}>
                                                    Make Payment
                                                </Link>:''
                                            }

                                            <Link
                                                to={`/user/receipts/receipt-details/${receipt._id}`}
                                                className="btn btn-success btn-sm m-1"
                                            >
                                                <ion-icon name="eye-outline"></ion-icon>
                                            </Link>

                                        {/* {
                                            (Helpers.authUser.user_role == null || parseInt(perms.can_update) === 1) &&
                                            <ActionButton icon={"create-outline"} color={"success"} onClick={() => hanldeEdit(customer)} />
                                        } */}
                                        {
                                            (Helpers.authUser.user_role == null || parseInt(perms.can_delete) === 1) &&
                                            <ActionButton icon={"trash-outline"} color={"danger"} onClick={() => handleDelete(receipt._id)} />
                                        }
                                        </td>
                                    </tr>
                                    );
                                })}
                                </DataTable>
                                {receipts.length === 0 ?<div className="text-center">
                                No data available to display
                                </div> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}