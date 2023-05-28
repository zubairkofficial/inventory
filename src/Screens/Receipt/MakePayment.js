import { Link, useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../Components/PageTitle";
import Helpers from "../../Config/Helpers";
import Input from "../../Components/Input";
import { useEffect, useState, useReducer } from "react";
import AddSelectInput from "../../Components/Receipt/AddSelectInput";
import Button from "../../Components/Button";
import Moment from "react-moment";
import axios from "axios";

export default function MakePayment() {
  //payment Types
  let paymentTypeOptions = [
    { label: "Cash", value: "Cash" },
    { label: "Card", value: "Card" },
    { label: "Check", value: "Check" },
    { label: "Online", value: "Online" },
  ];
  let [selectedPaymentType, setSelectedPaymentType] = useState([]);

  const [receipt, setReceipt] = useState([]);
  const [payment, setPayment] = useState([]);
  const [errors, setErrors] = useState({});
  const { receipt_id } = useParams();
  const [btnLoading, setBtnLoading] = useState(false);
  let today = new Date().toISOString().split("T")[0];
  let navigate = useNavigate();

  const getReceipt = () => {
    axios
      .get(`${Helpers.baseUrl}receipts/details/${receipt_id}`, Helpers.headers)
      .then((response) => {
        setReceipt(response.data);
        setPayment({
          ...payment,
          receipt_id: response.data._id,
          amount_due: response.data.remaining,
          amount_remaining: 0,
          amount_paid: response.data.remaining,
        });
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };

  const handlePaymentTypeChange = (selected) => {
    if (selected) {
      setSelectedPaymentType(selected);
      setPayment({ ...payment, payment_type: selected.value });
    } else {
      setSelectedPaymentType(null);
      setPayment({ ...payment, payment_type: "" });
    }
  };

  const handlePaidAmount = (e) => {
    const paid = e.target.value;
    const due = parseFloat(payment.amount_due);
    const remaining = (due - paid).toFixed(2);
    let p_status = "Unpaid";
    if (parseInt(remaining) > 0) {
      p_status = "Partialy Paid";
    } else {
      p_status = "Paid";
    }
    let org_paid = parseInt(receipt.paid);
    org_paid += parseFloat(paid);
    org_paid = org_paid.toFixed(2);

    setPayment({
      ...payment,
      amount_paid: paid,
      amount_remaining: remaining,
      paid: org_paid,
      status: p_status,
    });
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    setBtnLoading(true);
    axios
      .post(`${Helpers.baseUrl}receipts/add-payment`, payment, Helpers.headers)
      .then((response) => {
        Helpers.toast("success", "Payment Added successfully");
        setBtnLoading(false);
        navigate("/user/receipts");
      })
      .catch((error) => {
        getReceipt();
        setErrors(Helpers.error_response(error));
        setBtnLoading(false);
      });
  };

  useEffect(() => {
    getReceipt();
  }, []);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle
          title={"Make Payment"}
          children={
            <>
              <Link className="btn btn-success m-1" to="/user/receipts">
                <i className="fa fa-list"></i> All Receipts
              </Link>
              <Link className="btn btn-light m-1" to="/user/receipts/unpaid">
                <i className="fa fa-list"></i> All Unpaid Receipts
              </Link>
            </>
          }
        ></PageTitle>
        <div className="row">
          <div className="col-8">
            <div className="card">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card-body p-4">
                    <div className="row g-3">
                      <div className="col-lg-3 col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          Invoice No
                        </p>
                        <h5 className="fs-14 mb-0">
                          #<span id="invoice-no">{receipt._id}</span>
                        </h5>
                      </div>

                      <div className="col-lg-3 col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          Date
                        </p>
                        <h5 className="fs-14 mb-0">
                          <span id="invoice-date">
                            <Moment date={receipt.date} />
                          </span>{" "}
                        </h5>
                      </div>

                      <div className="col-lg-3 col-6">
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

                      <div className="col-lg-3 col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          Total Amount
                        </p>
                        <h5 className="fs-14 mb-0">
                          $<span id="total-amount">{receipt.totalPrice}</span>
                        </h5>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="card-body p-4 border-top border-top-dashed">
                        <div className="row g-3">
                          <div className="col-6">
                            <h6 className="text-muted text-uppercase fw-semibold mb-3">
                              Customer Details
                            </h6>
                            <p className="fw-medium mb-2" id="billing-name">
                              {receipt.customer ? receipt.customer.name : ""}
                            </p>
                            <p
                              className="text-muted mb-1"
                              id="billing-address-line-1"
                            >
                              {receipt.customer ? receipt.customer.address : ""}
                            </p>
                            <p className="text-muted mb-1">
                              <span>Phone: </span>
                              <span id="billing-phone-no">
                                {receipt.customer ? receipt.customer.phone : ""}
                              </span>
                            </p>
                            <p className="text-muted mb-0">
                              <span>Email: </span>
                              <span id="billing-tax-no">
                                {receipt.customer ? receipt.customer.email : ""}
                              </span>{" "}
                            </p>
                          </div>

                          <div className="col-6">
                            <h6 className="text-muted text-uppercase fw-semibold mb-3">
                              Vehicle Details
                            </h6>
                            <p className="text-muted mb-2">
                              <span>Company: </span>{" "}
                              {receipt.vehicle ? receipt.vehicle.company : ""}
                            </p>
                            <p
                              className="text-muted mb-1"
                              id="shipping-address-line-1"
                            >
                              <span>Name: </span>{" "}
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
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="card-body border-top border-top-dashed p-4">
                        <div className="row">
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
                              {receipt.status != "Unpaid" ? (
                                <p className="text-muted mb-1">
                                  Payment Method:{" "}
                                  <span
                                    className="fw-medium"
                                    id="payment-method"
                                  >
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
                                <span id="card-total-amount">
                                  {receipt.paid}
                                </span>
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
                                        Payment History:
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
                                        Payment Remaining:{" "}
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card">
              <div className="card-header">
                <h4>Add Payment Details</h4>
              </div>
              <div className="card-body">
                <form>
                  <Input
                    label={"Amount Due"}
                    value={payment.amount_due}
                    type={"number"}
                    readOnly={true}
                    error={errors.amount_due}
                  />
                  <Input
                    label={"Amount Paid"}
                    value={payment.amount_paid}
                    type={"number"}
                    error={errors.amount_paid}
                    onChange={handlePaidAmount}
                  />

                  <Input
                    label={"Amount Remaining"}
                    value={payment.amount_remaining}
                    type={"number"}
                    error={errors.amount_remaining}
                    readOnly={true}
                  />

                  <AddSelectInput
                    isMulti={false}
                    label={"Select Payment Type"}
                    options={paymentTypeOptions}
                    selected={selectedPaymentType}
                    error={errors.payment_type}
                    onChange={handlePaymentTypeChange}
                    onBtnClick={() => {}}
                    targetModal={"addServiceModal"}
                    hasBtn={false}
                  />

                  <Input
                    label={"Payment Date"}
                    value={payment.payment_date}
                    type={"date"}
                    error={errors.payment_date}
                    onChange={(e) =>
                      setPayment({ ...payment, payment_date: e.target.value })
                    }
                  />

                  <Button
                    text={"Add Payment"}
                    color={"success"}
                    onClick={handleSavePayment}
                    isLoading={btnLoading}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
