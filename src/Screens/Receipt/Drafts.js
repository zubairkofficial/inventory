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

export default function Drafts() {
    useTitle("Drafts");
    let navigate = useNavigate();

    const permissions = usePermissions();
    const [perms, setPerms] = useState([]);

    const [drafts, setDrafts] = useState([]);
    const [data, setData] = useState([]);

    const getDrafts = () => {
        axios
        .get(`${Helpers.baseUrl}receipts/drafts/all/${Helpers.authParentId}`, Helpers.headers)
        .then((response) => {
            setDrafts(response.data.reverse());
            setData(response.data);
        })
        .catch((error) => {
            Helpers.unauthenticated(error, navigate);
        });
    };

    const handleDelete = (draftId) => {
        Helpers.confirmBox(`${Helpers.baseUrl}receipts/delete/${draftId}`, navigate, getDrafts)
    };

    useEffect(() => {
        getDrafts();
        setPerms(permissions);
    
    }, []);

    return (
        <div className="page-content">
            <div className="container-fluid">
                <PageTitle title={"All Drafts"}/>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body border-bottom">
                                <CardHeader title={"All Drafts"} setState={setDrafts} data={data} fields={["customer.name", "vehicle.name", "vehicle.model", "totalPrice", "paid", "remaining", "status"]} />
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
                                {drafts.map((draft, index) => {
                                    return (
                                    <tr key={draft._id}>
                                        <td>{index + 1}</td>
                                        <td>{draft.customer ? draft.customer.name : ''}</td>
                                        <td>{draft.vehicle ? draft.vehicle.name+' '+draft.vehicle.model : ''}</td>
                                        <td>$ {draft.totalPrice}</td>
                                        <td>$ {draft.paid}</td>
                                        <td>$ {draft.remaining}</td>
                                        <td>{draft.status}</td>
                                        <td>{moment(draft.createdAt).format("MMM DD, YY hh:mm A")}</td>
                                        <td>
                                            

                                            <Link
                                                to={`/user/receipts/drafts-edit/${draft._id}`}
                                                className="btn btn-success btn-sm m-1"
                                            >
                                                <ion-icon name="create-outline"></ion-icon>
                                            </Link>
                                            
                                        {
                                            (Helpers.authUser.user_role == null || parseInt(perms.can_delete) === 1) &&
                                            <ActionButton icon={"trash-outline"} color={"danger"} onClick={() => handleDelete(draft._id)} />
                                        }
                                        </td>
                                    </tr>
                                    );
                                })}
                                </DataTable>
                                {drafts.length === 0 ?<div className="text-center">
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