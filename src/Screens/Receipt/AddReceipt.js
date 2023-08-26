import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../Components/PageTitle";
import Helpers from "../../Config/Helpers";
import Input from "../../Components/Input";
import Textarea from "../../Components/Textarea";
import { useEffect, useState, useReducer } from "react";
import AddSelectInput from "../../Components/Receipt/AddSelectInput";
import { customerReducer } from "../../Reducers/CustomerReducer";
import AddCustomer from "../../Components/Receipt/AddCustomer";
import AddVehicleReceipt from "../../Components/Receipt/AddVehicle";
import SelectedService from "../../Components/Receipt/SelectedService";
import Button from "../../Components/Button";
import axios from "axios";

export default function AddReceipt() {
  let receiptInit = {
    date: Helpers.currentDate(),
    created_date: "",
    customer: "",
    technician: "",
    vehicle: "",
    services: "",
    tires: "",
    tiresQuantity: 0,
    tiresPrice: 0,
    oil: "",
    oilQuantity: 0,
    extraOilQuantity: 0,
    extraOilPrice: 0,
    oilPrice: 0,
    totalPrice: 0,
    paid: 0,
    remaining: 0,
    status: "",
    paymentType: "",
    taxIncluded: false,
    taxType: "",
    tax: 0,
    discountIncluded: false,
    discountType: "",
    discount: 0,
    tiresTax: 0,
    user_id: Helpers.authParentId,
    note: "",
    isDraft: 0,
  };

  let navigate = useNavigate();

  const [receiptRed, dispatch] = useReducer(customerReducer, receiptInit);

  const [errors, setErrors] = useState({});

  const [receipt, setReceipt] = useState(receiptInit);
  // Customers
  const [customerOptions, setCustomersOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  // Vehilcles
  let [vehiclesOptions, setVehiclesOptions] = useState([]);
  let [selectedVehicle, setSelectedVehicle] = useState(null);
  // Services
  let [serviceOptions, setServiceOptions] = useState([]);
  let [selectedServices, setSelectedServices] = useState([]);
  const [lastSelectedService, setLastSelectedService] = useState(null);
  // Tires
  let [tireOptions, setTireOptions] = useState([]);
  let [selectedTires, setSelectedTires] = useState([]);
  //Technician
  let [technicianOptions, setTechnicianOptions] = useState();
  let [selectedTechnician, setSelectedTechnician] = useState([]);
  //payment status
  let statusOptions = [
    { label: "Unpaid", value: "Unpaid" },
    { label: "Partialy Paid", value: "Partialy Paid" },
    { label: "Paid", value: "Paid" },
  ];
  let [selectedStatus, setSelectedStatus] = useState("");
  //payment Types
  let paymentTypeOptions = [
    { label: "Cash", value: "Cash" },
    { label: "Card", value: "Card" },
    { label: "Check", value: "Check" },
    { label: "Online", value: "Online" },
  ];
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  //tax
  const [taxValue, setTaxValue] = useState([]);
  //Button Loading
  const [btnLoading, setBtnLoading] = useState(false);

  // Modals State
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showVehilcleModal, setShowVehilcleModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const handleCustomerChange = (selected) => {
    console.log(selected);
    if (selected) {
      setSelectedCustomer(selected);
      // if (selected.value.tax === "Taxable") {
        // alert('it works')
        setReceipt({
          ...receipt,
          customer: selected ? selected.value : "",
          taxIncluded: true,
          taxType: selected.value.tax === "Taxable" ? taxValue.tax : "",
        });
      // }
    } else {
      setSelectedCustomer(null);
      setReceipt({ ...receipt, customer: selected ? selected.value : "" });
    }
    if (selected) {
      dispatch({
        type: "getCustomerVehicles",
        states: { setVehiclesOptions },
        data: { customerId: selected.value._id },
      });
    } else {
      setVehiclesOptions([]);
      setSelectedVehicle({});
    }
  };

  const handleVehicleChange = (selected) => {
    if (selected) {
      setSelectedVehicle(selected);
    } else {
      setSelectedVehicle(null);
    }
    setReceipt({ ...receipt, vehicle: selected ? selected.value : "" });
  };

  const handleServicesChange = (selected) => {
    if (selected.length === 0) {
      setReceipt({ ...receipt, totalPrice: 0, remaining: 0, tax: 0 });
    }
    if (receipt.vehicle) {
      let previousLength = selectedServices.length;
      setSelectedServices(selected);
      calculateTotalServices();
      setReceipt({ ...receipt, services: selected });
      if (selected.length > 0 && selected.length > previousLength) {
        setLastSelectedService(selected[selected.length - 1]);
        setShowServiceModal(true);
      }
    } else {
      Helpers.toast("error", "Select a vehicle to add service");
    }
  };

  const handleTiresChange = (selected) => {
    setSelectedTires(selected);
    
    const services = selectedServices.concat(selected);
    const uniqueServices = services.reduce((acc, service) => {
      const exists = acc.find((s) => s.label === service.label);
      if (!exists) {
        acc.push(service);
      }
      return acc;
    }, []);

    handleServicesChange(uniqueServices);
  };

  const handleTechnicianChange = (selected) => {
    setSelectedTechnician(selected);
    let techs = [];
    selected.forEach(single => {
      techs.push(single.value);
    })
    setReceipt({...receipt, technician: techs});
    // const techs = selectedTechnician.concat(selected);
    // const uniqueTechs = techs.reduce((acc, tech) => {
    //   const exists = acc.find(t => t.label === tech.label);
    //   if(!exists){
    //     acc.push(tech);
    //   }
    //   return acc;
    // }, []);
    // if (selected) {
    //   setSelectedTechnician(selected);
    //   setReceipt({ ...receipt, technician: selected.value });
    // } else {
    //   setSelectedTechnician(null);
    //   setReceipt({ ...receipt, technician: "" });
    // }
  };

  const handleStatusChange = (selected) => {
    if (selected) {
      setSelectedStatus(selected);
      if (selected.value == "Unpaid") {
        let paidPrice = 0;
        let remainingPrice = receipt.totalPrice;
        setReceipt({
          ...receipt,
          status: selected.value,
          paid: paidPrice,
          remaining: remainingPrice,
        });
      } else {
        let paidPrice = receipt.totalPrice;
        let remainingPrice = 0;
        setReceipt({
          ...receipt,
          status: selected.value,
          paid: paidPrice,
          remaining: remainingPrice,
        });
      }
    } else {
      setSelectedStatus(null);
      setReceipt({ ...receipt, status: "" });
    }
  };

  const handlePaymentTypeChange = (selected) => {
    if (selected) {
      setSelectedPaymentType(selected);
      setReceipt({ ...receipt, paymentType: selected.value });
    } else {
      setSelectedPaymentType(null);
      setReceipt({ ...receipt, paymentType: "" });
    }
  };

  const handlePaymetPaidChange = (paid) => {
    let remaining = parseFloat(
      parseFloat(receipt.totalPrice) - paid.target.value
    ).toFixed(2);
    if (parseFloat(paid.target.value) >= receipt.totalPrice) {
      setReceipt({
        ...receipt,
        paid: paid.target.value,
        remaining: remaining,
        status: "Paid",
      });
    } else {
      setReceipt({
        ...receipt,
        paid: paid.target.value,
        remaining: remaining,
        status: "Partialy Paid",
      });
    }
  };

  const handleNoteChnage = (note) => {
    setReceipt({ ...receipt, note: note.target.value });
  };

  const handleTaxChange = e => {
      setReceipt({...receipt, taxType: e.target.value});
      // if(!isNaN(value)){
      //   setReceipt({...receipt, taxType: value});
      //   
      // }
  }

  useEffect(() => {
    calculateTotalServices();
  }, [receipt.taxType, selectedServices, receipt.taxIncluded, receipt.paid]);

  const calculateTotalServices = () => {
    let prices = 0;
    let taxPrice = 0;
    let tiresTotalPrice = 0;

    if (selectedServices.length === 0) {
      setReceipt({ ...receipt, totalPrice: 0, remaining: 0, tax: 0 });
    } else {
      for (let i = 0; i < selectedServices.length; i++) {
        if (selectedServices[i].value.type === "tire_service") {
          tiresTotalPrice += parseFloat(selectedServices[i].value.total_price);
        }
        if (selectedServices[i].value.tax === "Taxable") {
          taxPrice += parseFloat(selectedServices[i].value.total_price);
        }
        prices += parseFloat(selectedServices[i].value.total_price);
      }
      prices = prices.toFixed(2);

      let tireTax = 0;
      tireTax = ((parseFloat(tiresTotalPrice) * 2) / 100).toFixed(2);

      let total = prices;
      let TAX = 0;
      if (receipt.taxIncluded) {
        let tax_value = parseFloat((receipt.taxType * taxPrice) / 100).toFixed(
          2
        );
        total = (parseFloat(total) + parseFloat(tax_value)).toFixed(2);
        TAX = tax_value;
      }
      let paid = parseFloat(receipt.paid).toFixed(2);
      let remaining = (total - paid).toFixed(2);
      setReceipt({
        ...receipt,
        totalPrice: total,
        remaining: remaining,
        tax: TAX,
        tiresTax: tireTax,
      });
    }
  };

  const handleSaveReceipt = (e) => {
    e.preventDefault();
    // let date = new Date();
    // console.log(date);
    setBtnLoading(true);
    setErrors({});
    if(receipt.services){
      if(receipt.status){
        let data = receipt;
        receipt.created_date = Helpers.getCurrentDateTime();
        axios
          .post(`${Helpers.baseUrl}receipts/add`, data, Helpers.headers)
          .then((response) => {
            // console.log(response.data);
            setReceipt(receiptInit);
            // setIsEditing(false);
            Helpers.toast("success", "Receipt saved successfully");
            setBtnLoading(false);
            navigate("/user/receipts");
          })
          .catch((error) => {
            setErrors(Helpers.error_response(error));
            setBtnLoading(false);
          });
      }else{
        setErrors({...errors, services: "Payment status is required"});
      }
    }else{
      setErrors({...errors, services: "Services field is required"});
    }
  };

  // useEffect(() => {
  //   if (receipt.isDraft) {
      
  //   }
  // }, [receipt.isDraft]);

  const handleSaveDraft = (e) => {
    e.preventDefault();
    setBtnLoading(true);
    setErrors({});
    let data = receipt;
    data.isDraft = 1;
    data.created_date = Helpers.getCurrentDateTime();
    //   const addOrUpdate = isEditing ? "update" : "add";
    axios.post(`${Helpers.baseUrl}receipts/add`, data, Helpers.headers).then((response) => {
        // setIsEditing(false);
        Helpers.toast("success", "Receipt saved as Draft successfully");
        setBtnLoading(false);
        navigate("/user/drafts");
    }).catch((error) => {
        setErrors(Helpers.error_response(error));
        setBtnLoading(false);
    });
  };

  useEffect(() => {
    dispatch({ type: "getCustomers", states: { setCustomersOptions } });
    dispatch({ type: "getAllServices", states: { setServiceOptions } });
    dispatch({ type: "getTires", states: { setTireOptions } });
    dispatch({ type: "getTechnicians", states: { setTechnicianOptions } });
    dispatch({ type: "getTax", states: { setTaxValue } });
  }, []);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title={"Create New Receipt"}>
          <Link className="btn btn-success m-1" to="/user/receipts">
            <i className="fa fa-list"></i> All Receipts
          </Link>
        </PageTitle>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5>Create New Receipt</h5>
              </div>
              <div className="card-body border-bottom">
                <form>
                  <div className="row">
                    <div className="col-6">
                      <Input
                        type="date"
                        placeholder={"yyyy/mm/dd"}
                        error={errors.date}
                        value={receipt.date}
                        onChange={(e) =>
                          setReceipt({ ...receipt, date: e.target.value })
                        }
                      />
                      <AddSelectInput
                        label={"Select Customer"}
                        options={customerOptions}
                        selected={selectedCustomer}
                        error={selectedCustomer ? "" : errors.customer}
                        onChange={handleCustomerChange}
                        onBtnClick={() => setShowCustomerModal(true)}
                        targetModal={"addCustomerModal"}
                      />
                      <AddSelectInput
                        label={"Select Vehicle"}
                        options={vehiclesOptions}
                        selected={selectedVehicle}
                        error={selectedVehicle ? "" : errors.vehicle}
                        onChange={handleVehicleChange}
                        onBtnClick={() =>
                          receipt.customer
                            ? setShowVehilcleModal(true)
                            : Helpers.toast(
                                "error",
                                "Choose a customer to add vehilce"
                              )
                        }
                        targetModal={"addVehicleModal"}
                      />
                      <AddSelectInput
                        isMulti={true}
                        label={"Select Service"}
                        options={serviceOptions}
                        selected={selectedServices}
                        error={selectedServices.length === 0 ? errors.services : ""}
                        onChange={handleServicesChange}
                        onBtnClick={() => {}}
                        targetModal={"addServiceModal"}
                      />
                      <AddSelectInput
                        isMulti={true}
                        label={"Select Tire Service"}
                        options={tireOptions}
                        selected={selectedTires}
                        error={errors.tire}
                        onChange={handleTiresChange}
                        onBtnClick={() => {}}
                        targetModal={"addServiceModal"}
                        hasBtn={false}
                      />
                      <AddSelectInput
                        isMulti={true}
                        label={"Select Technician"}
                        options={technicianOptions}
                        selected={selectedTechnician}
                        error={selectedTechnician.length === 0 ? errors.technician : ""}
                        onChange={handleTechnicianChange}
                        onBtnClick={() => {}}
                        targetModal={"addServiceModal"}
                        hasBtn={false}
                      />
                      <Input
                        label={"Tax"}
                        value={receipt.taxType}
                        onChange={handleTaxChange}
                        placeholder={"Payment Paid"}
                        type={"number"}
                      />
                      <AddSelectInput
                        isMulti={false}
                        label={"Select Payment Status"}
                        options={statusOptions}
                        selected={selectedStatus}
                        error={selectedStatus ? "" : errors.status}
                        onChange={handleStatusChange}
                        onBtnClick={() => {}}
                        targetModal={"addServiceModal"}
                        hasBtn={false}
                      />
                      {receipt.status == "Paid" ||
                      receipt.status == "Partialy Paid" ? (
                        <>
                          <AddSelectInput
                            isMulti={false}
                            label={"Select Payment Type"}
                            options={paymentTypeOptions}
                            selected={selectedPaymentType}
                            error={errors.paymentType}
                            onChange={handlePaymentTypeChange}
                            onBtnClick={() => {}}
                            targetModal={"addServiceModal"}
                            hasBtn={false}
                          />
                          <Input
                            label={"Paid Amount"}
                            value={receipt.paid}
                            onChange={handlePaymetPaidChange}
                            placeholder={"Payment Paid"}
                            type={"number"}
                          />
                        </>
                      ) : (
                        ""
                      )}
                      <Textarea
                        label={"Enter Note"}
                        value={receipt.note}
                        onChange={handleNoteChnage}
                      />
                      <div className="row">
                        <div className="col-4">
                          <Button
                            text={"Save Receipt"}
                            color={"success"}
                            onClick={handleSaveReceipt}
                            isLoading={btnLoading}
                          />
                        </div>

                        <div className="col-4">
                          <Button
                            text={"Save Draft"}
                            color={"warning"}
                            onClick={handleSaveDraft}
                            isLoading={btnLoading}
                          />
                        </div>

                        <div className="col-4">
                          <Button
                            text={"Cancel Receipt"}
                            color={"danger"}
                            onClick={(event) => {
                              event.preventDefault();
                              setReceipt(receiptInit);
                              navigate('/user/receipts');
                            }}
                            // isLoading={btnLoading}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="card">
                        <div className="card-header">
                          <h4>Receipt Details</h4>
                          <h6>Receipt Date: {receipt.date && receipt.date}</h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-6">
                              <h5>Customer Info</h5>
                              <h6>
                                <strong>Name: </strong>
                                {receipt.customer && receipt.customer.name}
                              </h6>
                              <h6>
                                <strong>Phone: </strong>
                                {receipt.customer &&
                                  "+" + receipt.customer.phone}
                              </h6>
                              <h6>
                                <strong>Email: </strong>
                                {receipt.customer && receipt.customer.email}
                              </h6>
                              <h6>
                                <strong>Address: </strong>
                                {receipt.customer && receipt.customer.address}
                              </h6>
                            </div>
                            <div className="col-6">
                              <h5>Vehicle Info</h5>
                              <h6>
                                <strong>Make / Company: </strong>
                                {receipt.vehicle && receipt.vehicle.name}
                              </h6>
                              <h6>
                                <strong>Model: </strong>
                                {receipt.vehicle && receipt.vehicle.model}
                              </h6>
                              <h6>
                                <strong>VIN Number: </strong>
                                {receipt.vehicle && receipt.vehicle.vin_number}
                              </h6>
                              <h6>
                                <strong>Make Year: </strong>
                                {receipt.vehicle && receipt.vehicle.year}
                              </h6>
                            </div>
                          </div>
                          {/* {"Total Length" + receipt.services.length} */}
                          <div className="row" style={{ marginTop: 20 }}>
                            <div className="col-12">
                              <table className="table">
                                {(receipt.services ||
                                  receipt.services.length > 0) && (
                                  <thead>
                                    <tr>
                                      <th>Service</th>
                                      <th>Unit Price</th>
                                      <th>Qty.</th>
                                      <th>Total Price</th>
                                    </tr>
                                  </thead>
                                )}
                                <tbody>
                                  {receipt.services &&
                                    receipt.services.map((service, i) => (
                                      <tr key={i}>
                                        <td>
                                          {service.value.name}{" "}
                                          <span className="text-muted">
                                            <small>
                                              {service.value.tax === "Taxable"
                                                ? ""
                                                : "(Non Taxable)"}
                                            </small>
                                          </span>{" "}
                                          <br />
                                          <span className="text-muted">
                                            <small>
                                              {service.value.description}
                                            </small>
                                          </span>{" "}
                                          <br />
                                        </td>
                                        <td>${service.value.price}</td>
                                        <td>{service.value.quantity}</td>
                                        <td>${service.value.total_price}</td>
                                      </tr>
                                    ))}
                                  {receipt.taxIncluded == true ? (
                                    <tr>
                                      <th>SubTotal</th>
                                      <th></th>
                                      <th></th>
                                      <th>
                                        {" "}
                                        ${" "}
                                        {(
                                          parseFloat(receipt.totalPrice) -
                                          parseFloat(receipt.tax) -
                                          parseFloat(receipt.tiresTax)
                                        ).toFixed(2)}
                                      </th>
                                    </tr>
                                  ) : null}
                                  {receipt.tiresTax != 0 ? (
                                    <tr>
                                      <th>
                                        Tires Disposable Fee <small>(2%)</small>
                                      </th>
                                      <th></th>
                                      <th></th>
                                      <th> $ {receipt.tiresTax}</th>
                                    </tr>
                                  ) : null}
                                  {receipt.taxIncluded == true ? (
                                    <tr>
                                      <th>
                                        Include Tax{" "}
                                        <small>({receipt.taxType}%)</small>
                                      </th>
                                      <th></th>
                                      <th></th>
                                      <th> $ {receipt.tax}</th>
                                    </tr>
                                  ) : null}
                                  {(receipt.services ||
                                    receipt.services.length > 0) && (
                                    <>
                                      <tr>
                                        <th>Total Price</th>
                                        <th></th>
                                        <th></th>
                                        <th>${receipt.totalPrice}</th>
                                      </tr>
                                      <tr>
                                        <th>Paid</th>
                                        <th></th>
                                        <th></th>
                                        <th>${receipt.paid}</th>
                                      </tr>
                                      <tr>
                                        <th>Remaining</th>
                                        <th></th>
                                        <th></th>
                                        <th>${receipt.remaining}</th>
                                      </tr>
                                      <tr>
                                        <th>Payment Status</th>
                                        <th></th>
                                        <th></th>
                                        <th>{receipt.status}</th>
                                      </tr>
                                    </>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <AddCustomer
          showModal={showCustomerModal}
          modalState={setShowCustomerModal}
          handleCustomerChange={handleCustomerChange}
          setCustomersOptions={setCustomersOptions}
        />
        <AddVehicleReceipt
          showModal={showVehilcleModal}
          modalState={setShowVehilcleModal}
          customer={selectedCustomer}
          handleVehicleChange={handleVehicleChange}
          setVehiclesOptions={setVehiclesOptions}
        />
        {lastSelectedService && (
          <SelectedService
            showModal={showServiceModal}
            modalState={setShowServiceModal}
            lastService={lastSelectedService}
            setSelectedServices={setSelectedServices}
            selectedServices={selectedServices}
            setLastSelectedService={setLastSelectedService}
            calculateTotalServices={calculateTotalServices}
          />
        )}
      </div>
    </div>
  );
}
