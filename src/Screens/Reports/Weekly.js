import { useState, useEffect } from "react";
import axios from "axios";
import Helpers from "../../Config/Helpers";
import {Link, useNavigate } from "react-router-dom";
import DataTable from "../../Components/Datatable";
import ReportIcon from "../../Components/ReportIcon";
import CardHeader from "../../Components/CardHeader";
import { useTitle } from "../../Hooks/useTitle";
import moment from "moment";

function WeeklyReports() {
  useTitle("Weekly Reports");
  const [report, setReport] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicle] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [receiptsData, setReceiptsData] = useState([]);

  const user_id = Helpers.authParentId;

  let navigate = useNavigate();
  const getReport = () => {
    let current = Helpers.currentDate();
    let week_before = Helpers.weekBefore();
    axios
      .get(`${Helpers.baseUrl}reports/weekly/${current}/${week_before}/${Helpers.authParentId}`, Helpers.headers)
      .then((response) => {
        setReport(response.data);
        setReceipts(response.data.receipts.reverse());
        setCustomers(response.data.customers.reverse());
        setVehicle(response.data.vehicles.reverse());
        setReceiptsData(response.data.receipts);
        setCustomerData(response.data.customers);
        setVehiclesData(response.data.vehicles);
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };

  const calcPrice = (item) => {
    let total = 0;
    for (let index = 0; index < item.length; index++) {
      total += item[index].totalPrice;
    }
    return total.toFixed(2);
  };

  useEffect(() => {
    getReport();
  }, []);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">This Week's Report</h4>
            </div>
          </div>
        </div>
        <div className="row">
            <ReportIcon iconUrl={"https://cdn.lordicon.com/imamsnbq.json"} text={'Customers'} number={customers.length} />
            <ReportIcon iconUrl={"https://cdn.lordicon.com/uetqnvvg.json"} text={'Vehicles'} number={vehicles.length} />
            <ReportIcon iconUrl={"https://cdn.lordicon.com/nocovwne.json"} text={'Receipts Generated'} number={receipts.length} />
            <ReportIcon iconUrl={"https://cdn.lordicon.com/qhviklyi.json"} text={'Total Sale'} number={`$${calcPrice(receipts)}`} />
        </div>
        
        <div className="card" id="contactList">
            <div className="card-body">
                <CardHeader title={"Customer This Week"} setState={setCustomers} data={customerData} fields={["name", "email", "phone", "address"]} />
                <DataTable
                  columns={[
                    "Sr. #",
                    "Customer Name",
                    "Email",
                    "Phone",
                    "Address",
                    "Date",
                  ]}
                >
                  {customers.map((customer, index) => {
                    return (
                      <tr key={customer._id}>
                        <td>{index + 1}</td>
                        <td>{customer.name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.address}</td>
                        <td>{moment(customer.createdAt).format("MMM DD, YY hh:mm A")}</td>
                      </tr>
                    );
                  })}
                </DataTable>
                {customers.length === 0 ?<div className="text-center">
                  No data available to display
                </div> : null}    
          </div>
        </div>
        <div className="card" id="contactList">
            <div className="card-body">
                <CardHeader title={"Vehicles This Week"} setState={setVehicle} data={vehiclesData} fields={["name", "model", "year", "vin_number", 'customer.name']} />
                <DataTable
                  columns={[
                    "Sr. #",
                    "Vehicle Make",
                    "Model",
                    "Year",
                    "Vin Number",
                    "Customer Name",
                    "Date",
                  ]}
                >
                  {vehicles.map((vehicle, index) => {
                    return (
                      <tr key={vehicle._id}>
                        <td>{index + 1}</td>
                        <td>{vehicle.name}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.year}</td>
                        <td>{vehicle.vin_number}</td>
                        <td>{vehicle.customer ? vehicle.customer.name : ''}</td>
                        <td>{moment(vehicle.createdAt).format("MMM DD, YY hh:mm A")}</td>
                      </tr>
                    );
                  })}
                </DataTable>
                {vehicles.length === 0 ?<div className="text-center">
                  No data available to display
                </div> : null}    
            </div>
        </div>

        <div className="card" id="contactList">
            <div className="card-body">
                <CardHeader title={"Receipts This Week"} setState={setReceipts} data={receiptsData} fields={["customer.name", "vehicle.name", "totalPrice", "paid", 'remaining', 'status']} />
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
                        <td>{moment(receipt.createdAt).format("MMM DD, YY hh:mm A")}</td>
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
                {receipts.length === 0 ?<div className="text-center">
                  No data available to display
                </div> : null}
            </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyReports;
