import { Link } from "react-router-dom";
import DataTable from "../../Components/Datatable";

export default function TodayReceipts({ receipts }){
    return (
        <div className="card">
            <div className="card-header">
                <div className="row align-items-center g-3">
                    <div className="col-md-3">
                        <h5 className="card-title mb-0">Today Receipts</h5>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <DataTable 
                    columns={[
                        "Sr. #",
                        "Customer",
                        "Vehicle",
                        "Total Price",
                        "Amount Paid",
                        "Amount Remaining",
                        "Payment Status",
                        "Actions",
                    ]}
                >
                    {receipts.map((receipt, index) => {
                        return (
                            <tr key={receipt._id}>
                                <td>{index + 1}</td>
                                <td>{receipt.customer ? receipt.customer.name : ''}</td>
                                <td>{receipt.vehicle ? receipt.vehicle.name+' '+receipt.vehicle.model : ''}</td>
                                <td>${receipt.totalPrice}</td>
                                <td>${receipt.paid}</td>
                                <td>${receipt.remaining}</td>
                                <td>{receipt.status}</td>
                                <td>
                                    <Link
                                        to={`/user/receipts/receipt-details/${receipt._id}`}
                                        className="btn btn-success btn-sm"
                                    >
                                    <ion-icon name="eye-outline"></ion-icon>
                                    </Link>{" "}
                                </td>
                            </tr>
                        );
                    })}
                </DataTable>
                {receipts.length === 0 ? (<div className="text-center">
                    No data available to display
                </div>) : null}
            </div>
        </div>
    )
}