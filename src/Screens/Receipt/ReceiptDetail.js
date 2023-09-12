import { useState, useEffect, useRef, React } from "react";
import axios from "axios";
import Helpers from "../../Config/Helpers";
import { Link, useNavigate, useParams } from "react-router-dom";
import "izitoast-react/dist/iziToast.css";
import Moment from "react-moment";
import '../../Styles/Print.css';
import ReactToPrint from 'react-to-print';

export default function ReceiptDetails() {
  const receiptStyle = {
    width: '25cm'
  };
  const printRef = useRef();
  const elementRef = useRef(null);
  const [search, setSearch] = useState("");
  const [receipt, setReceipt] = useState([]);
  const { receipt_id } = useParams();
  const { show, setShow } = useState(false);
  const [image, setImageSrc] = useState(Helpers.authUser.profile);

  let navigate = useNavigate();
  const getReceipt = () => {
    axios
      .get(`${Helpers.baseUrl}receipts/details/${receipt_id}`, Helpers.headers)
      .then((response) => {
        setReceipt(response.data);
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };

  const printReceipt = () => {
    const invoiceDateDiv = document.querySelector("#invoice-date").closest(".col-lg-3");
    invoiceDateDiv.style.marginLeft = "auto";

    elementRef.current.style.marginTop = "3cm";
    const elementsToHide = document.querySelectorAll(".hide-on-print");
    const elementsToShow = document.querySelectorAll(".show-on-print");
    
    // Iterate over the elements and set the display property to "none"
    elementsToShow.forEach((element) => {
      element.classList.remove('d-none');
    });

    // Iterate over the elements and set the display property to "none"
    elementsToHide.forEach((element) => {
      element.style.display = "none";
    });

    // Trigger the print dialog
    window.print();

    // After printing, set the display property back to its original value
    elementsToHide.forEach((element) => {
      element.style.display = "";
    });

    elementsToShow.forEach((element) => {
      element.classList.add('d-none');
    });

    elementRef.current.style.marginTop = "";
  };

  useEffect(() => {
    getReceipt();
  }, []);
  
  useEffect(()=>{
    // setImageSrc(`${Helpers.baseUrl}uploads/${Helpers.authUser.profile}`);
  }, [receipt])

  // useEffect(()=>{
  //   axios.get(`${Helpers.baseUrl}uploads/${Helpers.authUser.profile}`)
  //   .then((response)=>{
  //     console.log(response)
  //   }).catch((error)=>{
  //     console.log(error)
  //   })
  // }, [])

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Receipt Details</h4>
              <div>
                {/* <button
                  onClick={printReceipt}
                  className="btn btn-success"
                >
                  <i className="ri-printer-line align-bottom me-1"></i>{" "}
                  Print
                </button> */}
                <ReactToPrint
                  trigger={() => <button className="btn btn-success"><i className="ri-printer-line align-bottom me-1"></i>{" "}Print</button>}
                  content={() => printRef.current}
                />
                <Link className="btn btn-success m-1" to="/user/receipts">
                  <i className="fa fa-list"></i> All Receipts
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center" id="receipt" ref={printRef}>
          <div className="col-xl-12" style={receiptStyle}>
            <div className="card" id="demo">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card-header border-bottom-dashed p-4">
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <img
                          src={`${Helpers.baseUrl}uploads/${image}`}
                          // src={image}
                          className="card-logo card-logo-dark"
                          alt="logo dark"
                          style={{
                            maxWidth: '100px',
                            maxHeight: '80px',
                            width: 'auto',
                            height: 'auto'
                          }} 
                        />
                  <div className="col-lg-12 col-12 text-right">
                    <p className="text-muted mb-2 text-uppercase fw-semibold m-1" style={{ display: "inline-block" }}>
                      Date
                    </p>
                    <h5 className="fs-14 mb-0 m-1 invoice-date" style={{ display: "inline-block" }}>
                      <span id="invoice-date">
                        <Moment date={receipt.date} format="ddd, MMM Do YYYY" />
                      </span>{" "}
                    </h5>
                  </div>
                        <div className="mt-3 text-right">
                          #<span id="invoice-no">{receipt.invoice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="col-lg-12">
                  <div className="card-body p-4"> */}
                    {/* <div className="row g-3"> */}
                      {/* <div className="col-lg-3 col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold m-1" style={{ display: "inline-block" }}>
                          Invoice No
                        </p>
                        <h5 className="fs-14 mb-0 m-1" style={{ display: "inline-block" }}>
                          #<span id="invoice-no">{receipt._id}</span>
                        </h5>
                      </div> */}
                      {/* <div className="col-lg-3 col-6 hide-on-print">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          Payment Status
                        </p>
                        <span
                          className={
                            receipt.status == "Paid"
                              ? "badge badge-soft-success fs-11"
                              : receipt.status == "Unpaid"
                              ? "badge badge-soft-danger fs-11"
                              : "badge badge-soft-warning fs-11"
                          }
                          id="payment-status"
                        >
                          {receipt.status}
                        </span>
                      </div>
                      <div className="col-lg-3 col-6 hide-on-print">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          Total Amount
                        </p>
                        <h5 className="fs-14 mb-0">
                          $<span id="total-amount">{receipt.totalPrice}</span>
                        </h5>
                      </div> */}
                    {/* </div> */}
                  {/* </div>
                </div> */}
                <div className="col-lg-12">
                  <div className="card-body p-4 border-top border-top-dashed">
                    <div className="row g-3">
                      <div className="col-5">
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">
                          Customer Details
                        </h6>
                        <p className="fw-medium mb-2" id="billing-name">
                          {receipt.customer ? receipt.customer.name : ""}
                        </p>
                        {/* <p
                          className="text-muted mb-1"
                          id="billing-address-line-1"
                        >
                          {receipt.customer ? receipt.customer.address : ""}
                        </p> */}
                        <p className="text-muted mb-1">
                          <span>Phone: </span>
                          <span id="billing-phone-no">
                            {receipt.customer ? receipt.customer.phone : ""}
                          </span>
                        </p>
                        {
                          receipt.customer && receipt.customer.email ? 
                          <p className="text-muted mb-0">
                            <span>Email: </span>
                            <span id="billing-tax-no">
                              {receipt.customer ? receipt.customer.email : ""}
                            </span>{" "}
                          </p> : ''
                        }
                        {
                          receipt.customer && receipt.customer.email ?
                          <p className="text-muted mb-0">
                            <span>Address: </span>
                            <span id="billing-tax-no">
                              {receipt.customer ? receipt.customer.address : ""}
                            </span>{" "}
                          </p> : ''
                        }
                      </div>
                      {/* Just some space */}
                      <div className="col-5">

                      </div>
                      <div className="col-2">
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">
                          Vehicle Details
                        </h6>
                        <p className="text-muted mb-1">
                          <span>Vin Number: </span>
                          <span id="shipping-phone-no">
                            {" "}
                            {receipt.vehicle ? receipt.vehicle.vin_number : ""}
                          </span>
                        </p>
                        <p className="text-muted mb-1">
                          <span>Year: </span>
                          <span id="shipping-phone-no">
                            {" "}
                            {receipt.vehicle ? receipt.vehicle.year : ""}
                          </span>
                        </p>
                        <p
                          className="text-muted mb-1"
                          id="shipping-address-line-1"
                        >
                          <span>Make: </span>{" "}
                          {receipt.vehicle ? receipt.vehicle.name : ""}
                        </p>
                        <p className="text-muted mb-1">
                          <span>Model: </span>
                          <span id="shipping-phone-no">
                            {" "}
                            {receipt.vehicle ? receipt.vehicle.model : ""}
                          </span>
                        </p>
                      </div>

                      {/* Technician Details */}
                      {/* <div className="col-3 text-right">
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">
                          Technician Details
                        </h6>
                        {receipt.technician && receipt.technician.map(tech => {
                          return (
                            <div>
                              <p className="text-muted mb-1">
                                <span><strong>Name:</strong> </span>
                                <span id="shipping-phone-no">
                                  {" "}
                                  {tech ? tech.name : ""}
                                </span>
                              </p>
                              <p
                                className="text-muted mb-1"
                                id="shipping-address-line-1"
                              >
                                <span><strong>Phone:</strong> </span>{" "}
                                {tech ? tech.phone : ""}
                              </p>
                            </div>
                          );
                        })}
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="card-body p-4">
                    <div className="table">
                      <table className="table table-borderless text-center align-middle mb-0">
                        <thead>
                          <tr className="table-active">
                            <th scope="col" className="text-start">Service Details</th>
                            {/* <th scope="col">Description</th> */}
                            <th scope="col">Technician</th>
                            <th scope="col">Qty</th>
                            <th scope="col">List</th>
                            <th scope="col" className="text-end">
                              Extended
                            </th>
                          </tr>
                        </thead>
                        <tbody id="products-list">
                          {receipt.services
                            ? receipt.services.map((service, i) => {
                                return [
                                  <tr>
                                    <td className="text-start">
                                      <span className="fw-medium">
                                        {service.value.name}<br/>
                                        <span className="text-muted">{service.value.description
                                        .split(", ")
                                        .join(",\n")
                                        }</span>
                                      </span>
                                      <span className="text-muted">
                                        <small>
                                          {service.value.tax === "Taxable"
                                            ? ""
                                            : "(Non Taxable)"}
                                        </small>
                                      </span>{" "}
                                      
                                      <br />
                                      {/* <div style={{whiteSpace: 'pre-wrap'}}>
                                        <span className="text-muted" >
                                          {service.value.description.split(", ").join(",\n")}
                                        </span>
                                      </div> */}
                                    </td>
                                    {/* <td>
                                      {service.value.description
                                        .split(", ")
                                        .join(",\n")}
                                    </td> */}
                                    <td>
                                      {service.value.technicianName}
                                    </td>
                                    <td className="fw-bold">
                                      {service.value.technician}
                                    </td>
                                    <td>{service.value.quantity}</td>
                                    <td>$ {service.value.pricePerQuartz}</td>
                                    <td className="text-end">
                                      $ {service.value.total_price}
                                    </td>
                                  </tr>,
                                ];
                              })
                            : null}
                        </tbody>
                      </table>
                    </div>
                    <div className="border-top border-top-dashed" ref={elementRef}>
                      <table className="table table-borderless table-nowrap align-middle mb-0 ms-auto">
                        <tbody>
                          <tr>
                            <td>Sub Total</td>
                            <td className="text-end">
                              ${" "}
                              {(
                                parseFloat(receipt.totalPrice) -
                                parseFloat(receipt.tax) -
                                parseFloat(receipt.tiresTax)
                              ).toFixed(2)}
                            </td>
                          </tr>
                          {receipt.taxInclude == "true" ? (
                            <tr>
                              <td>
                                Tax <small>({receipt.taxType}%)</small>
                              </td>
                              <td className="text-end">$ {receipt.tax}</td>
                            </tr>
                          ) : null}
                          {receipt.tiresTax != 0 ? (
                                <tr>
                                  <td>
                                    Tires Disposable Fee <small>(2%)</small>
                                  </td>
                                  <td className="text-end"> $ {receipt.tiresTax}</td>
                                </tr>
                              ) : null}
                          {receipt.discountInclude == "true" ? (
                            <tr>
                              <td>
                                Discount
                                <small className="text-muted"></small>
                              </td>
                              <td className="text-end">
                                -{" "}
                                {receipt.discountType == "percentage"
                                  ? receipt.discount + "%"
                                  : "$" + receipt.discount}
                              </td>
                            </tr>
                          ) : null}
                          <tr className="border-top border-top-dashed fs-15">
                            <th scope="row">Total Amount</th>
                            <th className="text-end">$ {receipt.totalPrice}</th>
                          </tr>
                          
                          <tr className="border-top border-top-dashed fs-15 d-none show-on-print">
                            <th scope="row">Status</th>
                            <td className="text-end">{receipt.status}</td>
                          </tr>
                          <tr className=" d-none show-on-print">
                            <th scope="row">Paid by</th>
                            <td className="text-end"> {receipt.paymentType}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* <div className="row hide-on-print">
                      <div className="col-12">
                            <div className="mt-3">
                            <h6 className="text-muted text-uppercase fw-semibold mb-3">
                              Receipt Note
                            </h6>
                            <p className="text-muted mb-1">
                              {receipt.note}
                            </p>
                            </div>
                      </div>
                      <div className="col">
                        <div className="mt-3">
                          <h6 className="text-muted text-uppercase fw-semibold mb-3">
                            Payment Details:
                          </h6>
                          <p className="text-muted mb-1">
                            Payment Status:{" "}
                            <span className="fw-medium" id="payment-method">
                              {receipt.status}
                            </span>
                          </p>
                          {receipt.status !== "Unpaid" ? (
                            <p className="text-muted mb-1">
                              Payment Method:{" "}
                              <span className="fw-medium" id="payment-method">
                                {receipt.paymentType}
                              </span>
                            </p>
                          ) : (
                            ""
                          )}
                          <p className="text-muted">
                            Total Amount:{" "}
                            <span className="fw-medium" id="">
                              ${" "}
                            </span>
                            <span id="card-total-amount">
                              {receipt.totalPrice}
                            </span>
                          </p>
                          <p className="text-muted">
                            Paid Amount:{" "}
                            <span className="fw-medium" id="">
                              ${" "}
                            </span>
                            <span id="card-total-amount">{receipt.paid}</span>
                          </p>
                          <p className="text-muted">
                            Remaining Amount:{" "}
                            <span className="fw-medium" id="">
                              ${" "}
                            </span>
                            <span id="card-total-amount">
                              {receipt.remaining}
                            </span>
                          </p>
                        </div>
                      </div>
                      {receipt.payments
                        ? receipt.payments.map((payment, i) => {
                            return [
                              <div className="col">
                                <div className="mt-3">
                                  <h6 className="text-muted text-uppercase fw-semibold mb-3">
                                    Payment History {i + 1}:
                                  </h6>
                                  <p className="text-muted mb-1">
                                    Payment Date:{" "}
                                    <span
                                      className="fw-medium"
                                      id="payment-method"
                                    >
                                      <Moment
                                        date={payment.payment_date}
                                        format="MMMM Do YYYY"
                                      />
                                    </span>
                                  </p>
                                  <p className="text-muted mb-1">
                                    Payment Type:{" "}
                                    <span
                                      className="fw-medium"
                                      id="payment-method"
                                    >
                                      {payment.payment_type}
                                    </span>
                                  </p>
                                  <p className="text-muted mb-1">
                                    Payment Due:{" "}
                                    <span
                                      className="fw-medium"
                                      id="payment-method"
                                    >
                                      $ {payment.amount_due}
                                    </span>
                                  </p>

                                  <p className="text-muted mb-1">
                                    Payment Paid:{" "}
                                    <span
                                      className="fw-medium"
                                      id="payment-method"
                                    >
                                      $ {payment.amount_paid}
                                    </span>
                                  </p>
                                  <p className="text-muted">
                                    Payment Remaining:{" "}
                                    <span className="fw-medium" id="">
                                      ${" "}
                                    </span>
                                    <span id="card-total-amount">
                                      {payment.amount_remaining}
                                    </span>
                                  </p>
                                </div>
                              </div>,
                            ];
                          })
                        : null}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

