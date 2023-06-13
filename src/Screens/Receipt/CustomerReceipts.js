import { useState, useEffect } from "react";
import axios from "axios";
import Helpers from "../../Config/Helpers";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import DataTable from "../../Components/Datatable";
import { immediateToast } from "izitoast-react";
import "izitoast-react/dist/iziToast.css";
import Moment from "react-moment";
import Select from "react-select";
import { useTitle } from "../../Hooks/useTitle";
import CardHeader from "../../Components/CardHeader";

function CustomerReceipts() {
  const { customer_id, customer_name } = useParams();
  useTitle(`${customer_name}'s Receipts`);
  let paymentTypeOptions = [
    { label: "Cash", value: "Cash" },
    { label: "Card", value: "Card" },
    { label: "Check", value: "Check" },
    { label: "Online", value: "Online" },
  ];
  const current_url = useLocation();

  const [search, setSearch] = useState("");
  const [perms, setPerms] = useState([]);
  const [receipts, setReceipts] = useState([]);
  
  const [unpaidReceipts, setUnpaidReceipts] = useState([]);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [isPaymentModelVisible, setIsPaymentModelVisible] = useState(false);
  const [errors, setErrors] = useState([]);
  const [paymentType, setPaymentType] = useState();
  const [paymentDate, setPaymentDate] = useState();
  const [receiptsData, setReceiptsData] = useState([]);
  // let unpaidReceipts = [];
  let [selectedPaymentType, setSelectedPaymentType] = useState("");
  

  let navigate = useNavigate();
  const getReceipts = () => {
    axios
      .get(`${Helpers.baseUrl}receipts/customer/${customer_id}`, Helpers.headers)
      .then((response) => {
        setReceipts(response.data.reverse());
        setReceiptsData(response.data);
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };



  const handleDelete = (receiptId) => {
    immediateToast("warning", {
      timeout: 20000,
      close: false,
      overlay: true,
      displayMode: "once",
      zindex: 9999,
      title: "",
      message: "Are you sure to delete this receipt",
      position: "center",
      buttons: [
        [
          "<button><b>YES</b></button>",
          function (instance, toast) {
            axios
              .get(
                `${Helpers.baseUrl}receipts/delete/${receiptId}`,
                Helpers.headers
              )
              .then((response) => {
                getReceipts();
                instance.hide({ transitionOut: "fadeOut" }, toast, "button");
                Helpers.toast("success", "Receipt deleted successfully");
              })
              .catch((error) => {
                Helpers.unauthenticated(error, navigate);
                instance.hide({ transitionOut: "fadeOut" }, toast, "button");
              });
          },
          true,
        ],
        [
          "<button>NO</button>",
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOut" }, toast, "button");
          },
        ],
      ],
    });
  };

  const getPerms = () => {
    const link = current_url.pathname;
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    if (permissions) {
      const perm = permissions.find(permission => permission.tab_link === '/receipts');
      setPerms(perm);
    }
  }

  const handleCheckBox = unpaidReceipt => {
    let id = unpaidReceipt.target.value;
    const receipt = receipts.find(rec => {return rec._id === id});

    const existingReceipt = unpaidReceipts.find(r => r._id === id);
    if (existingReceipt) {
      setUnpaidReceipts(unpaidReceipts.filter(r => r._id !== id));
    }else{
      setUnpaidReceipts(unpaidReceipts.concat(receipt));
    }
  }

  const handleBulkUpdate = () => {
    const sum = unpaidReceipts.reduce((acc, receipt) => acc + receipt.remaining, 0);
    setTotalRemaining(sum);
    setIsPaymentModelVisible(true);
    // console.log(sum);
  }
  
  const makeBulkPayment = () => {
    const payments = {
      receipts:unpaidReceipts,
      payment_type: paymentType,
      payment_date: paymentDate
    };

    axios
    .post(`${Helpers.baseUrl}receipts/bulk-payment`, payments, Helpers.headers)
    .then((response) => {
      Helpers.toast("success", "Payment Added successfully");
      getReceipts();
      setIsPaymentModelVisible(false);
    })
  };

  const handleSelectPaymentType = (selectedPaymentType) => {
    setSelectedPaymentType(selectedPaymentType);
    setPaymentType(selectedPaymentType.value );
  };

  useEffect(() => {
    getReceipts();
    getPerms();

  }, []);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Customer's Receipts</h4>
              <div>
                {
                  unpaidReceipts.length > 0 ? 
                  <button className="btn btn-success m-1" onClick={handleBulkUpdate}>Make Bulk Payment</button>: ''
                }
                
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body border-bottom">
                <CardHeader title={`All Receipts of ${customer_name}`} setState={setReceipts} data={receiptsData} fields={["vehicle.name", "totalPrice", "paid", "remaining", "status"]} />
                <DataTable
                  columns={[
                    "",
                    "Sr. #",
                    "Date",
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
                        <td>
                          {
                            receipt.status != 'Paid' && (perms.can_update == 1 || Helpers.authUser.user_role == null ) ?
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value={receipt._id} onClick={handleCheckBox} />
                          </div> : ''
                          }
                        </td>
                        <td>{index + 1}</td>
                        <td><Moment date={receipt.date} format="MMMM Do, YYYY" /></td>
                        <td>{receipt.vehicle ? receipt.vehicle.name +' '+receipt.vehicle.model : ''}</td>
                        <td>$ {receipt.totalPrice}</td>
                        <td>$ {receipt.paid}</td>
                        <td>$ {receipt.remaining}</td>
                        <td>{receipt.status}</td>
                        <td>
                          {
                            receipt.status != 'Paid' && (perms.can_update == 1 || Helpers.authUser.user_role == null ) ?
                            <Link className="btn btn-warning btn-sm m-1" to={`/user/unpaid-receipt/make-payment/${receipt._id}`}>
                            Make Payment
                          </Link>:''
                          }
                          
                          <Link
                            
                            to={`/user/receipts/receipt-details/${receipt._id}`}
                            className="btn btn-success btn-sm"
                          >
                            <ion-icon name="eye-outline"></ion-icon>
                          </Link>{" "}
                          {
                            perms.can_delete == 1 || Helpers.authUser.user_role == null ? 
                          <button
                            onClick={() => handleDelete(receipt._id)}
                            type="button"
                            className="btn btn-danger btn-sm"
                          >
                            <ion-icon name="trash-outline"></ion-icon>
                          </button> : null
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
      {isPaymentModelVisible && (<div className="modal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" style={{ background: 'rgba(0,0,0,0.5)', display: "block" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">Bulk Payment</h5>
            <button type="button" className="btn-close" onClick={() => setIsPaymentModelVisible(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-12 form-group mb-3">
                <label>Total Remaining</label>
                <input className="form-control" value={totalRemaining} onChange={(e)=>setTotalRemaining(e.target.value)} readOnly />
              </div>
              <div className="form-group mb-3">
                    <label>Payment Type</label>
                    <Select
                      options={paymentTypeOptions}
                      value={selectedPaymentType}
                      onChange={handleSelectPaymentType}
                      isClearable="true"
                    />
                    <small className="text-danger">
                      {errors.payment_type ? errors.payment_type : ""}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label>Payment Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={paymentDate}
                      onChange={(e) =>
                        setPaymentDate(e.target.value )
                      }
                    />
                    <small className="text-danger">
                      {errors.payment_date ? errors.payment_date : ""}
                    </small>
                  </div>
              <div className="col-12 form-group">
                <button className="btn btn-success m-1" onClick={makeBulkPayment}>Make Payment</button>
                <button className="btn btn-light m-1" onClick={() => setIsPaymentModelVisible(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)}
    </div>
  );
}

export default CustomerReceipts;
