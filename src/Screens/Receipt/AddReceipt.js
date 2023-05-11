import { Link } from "react-router-dom";
import PageTitle from "../../Components/PageTitle";
import Helpers from "../../Config/Helpers";
import Input from "../../Components/Input";
import { useEffect, useState, useReducer } from "react";
import AddSelectInput from "../../Components/Receipt/AddSelectInput";
import { customerReducer } from "../../Reducers/CustomerReducer";
import AddCustomer from "../../Components/Receipt/AddCustomer";
import AddVehicleReceipt from "../../Components/Receipt/AddVehicle";
import SelectedService from "../../Components/Receipt/SelectedService";

export default function AddReceipt(){
    let receiptInit = {
        date: new Date().toISOString().split("T")[0],
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
        isDraft:0,
    };

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

    const [taxValue, setTaxValue] = useState([]);

    // Modals State
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showVehilcleModal, setShowVehilcleModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);

    const handleCustomerChange = selected => {
        if(selected){
            setSelectedCustomer(selected);
            if(selected.value.tax === "Taxable"){
                setReceipt({...receipt, taxIncluded: true, taxType: taxValue.tax});
            }
        }else{
            setSelectedCustomer(null);
        }
        setReceipt({ ...receipt, customer: selected ? selected.value : '' });
        if(selected){
            dispatch({ type: 'getCustomerVehicles', states: { setVehiclesOptions }, data: { customerId: selected.value._id } })
        }else{
            setVehiclesOptions([]);
            setSelectedVehicle({});
        }
    }
    
    const handleVehicleChange = selected => {
        if(selected){
            setSelectedVehicle(selected);
        }else{
            setSelectedVehicle(null);
        }
        setReceipt({ ...receipt, vehicle: selected ? selected.value : '' });
    }

    const handleServicesChange = selected => {
        if(receipt.vehicle){
            let previousLength = selectedServices.length;
            setSelectedServices(selected);
            let prices = 0;
            let taxPrice = 0;
            for(let i = 0; i < selectedServices.length; i++){
                if(selectedServices[i].value.tax === "Taxable"){
                    taxPrice += parseFloat(selectedServices[i].value.total_price);
                }
                prices += parseFloat(selectedServices[i].value.total_price);
            }
            prices = prices.toFixed(2);
            let total = prices;
            let TAX = 0;
            if(receipt.taxIncluded){
                let tax_value = parseFloat((receipt.taxType * taxPrice) / 100).toFixed(2);
                total = total + tax_value;
                TAX = tax_value;
            }
            let paid = parseFloat(receipt.paid).toFixed(2);
            let remaining = total - paid;
            setReceipt({...receipt, totalPrice: total, remaining: remaining, tax: TAX, services: selected});
            if(selected.length > 0 && selected.length > previousLength){
                setLastSelectedService(selected[selected.length - 1]);
                setShowServiceModal(true);
            }
        }else{
            Helpers.toast("error", "Select a vehicle to add service")
        }
    }

    useEffect(() => {
        dispatch({ type: 'getCustomers', states: { setCustomersOptions } });
        dispatch({ type: 'getAllServices', states: { setServiceOptions } });
        dispatch({ type: 'getTax', states: { setTaxValue } });
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
                                            <Input type="date" placeholder={"yyyy/mm/dd"} error={errors.date} value={receipt.date} onChange={(e) =>
                                                setReceipt({ ...receipt, date: e.target.value })
                                            } />
                                            <AddSelectInput 
                                                label={"Select Customer"} 
                                                options={customerOptions} 
                                                selected={selectedCustomer} 
                                                error={errors.customer} 
                                                onChange={handleCustomerChange}
                                                onBtnClick={() => setShowCustomerModal(true)}
                                                targetModal={"addCustomerModal"}
                                            />
                                            <AddSelectInput 
                                                label={"Select Vehicle"} 
                                                options={vehiclesOptions} 
                                                selected={selectedVehicle} 
                                                error={errors.vehicle} 
                                                onChange={handleVehicleChange}
                                                onBtnClick={() => receipt.customer ? setShowVehilcleModal(true) : Helpers.toast("error", "Choose a customer to add vehilce")}
                                                targetModal={"addVehicleModal"}
                                            />
                                            <AddSelectInput 
                                                isMulti={true}
                                                label={"Select Service"} 
                                                options={serviceOptions} 
                                                selected={selectedServices} 
                                                error={errors.service} 
                                                onChange={handleServicesChange}
                                                onBtnClick={() => {}}
                                                targetModal={"addServiceModal"}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h4>Receipt Details</h4>
                                                    <h6>
                                                        Receipt Date:{" "}
                                                        {receipt.date && receipt.date}
                                                    </h6>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <h5>Customer Info</h5>
                                                            <h6><strong>Name: </strong>{ receipt.customer && receipt.customer.name }</h6>
                                                            <h6><strong>Phone: </strong>{ receipt.customer && "+" + receipt.customer.phone }</h6>
                                                            <h6><strong>Email: </strong>{ receipt.customer && receipt.customer.email }</h6>
                                                            <h6><strong>Address: </strong>{ receipt.customer && receipt.customer.address }</h6>
                                                        </div>
                                                        <div className="col-6">
                                                            <h5>Vehicle Info</h5>
                                                            <h6><strong>Make / Company: </strong>{ receipt.vehicle && receipt.vehicle.name }</h6>
                                                            <h6><strong>Model: </strong>{ receipt.vehicle && receipt.vehicle.model }</h6>
                                                            <h6><strong>VIN Number: </strong>{ receipt.vehicle && receipt.vehicle.vin_number }</h6>
                                                            <h6><strong>Make Year: </strong>{ receipt.vehicle && receipt.vehicle.year }</h6>
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{ marginTop: 20 }}>
                                                        <div className="col-12">
                                                            <table className="table">
                                                                {receipt.services && (
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
                                                                {receipt.services && receipt.services.map((service, i) => (
                                                                    <tr key={i}>
                                                                        <td>{service.value.name}{" "}
                                                                            <span className="text-muted">
                                                                                <small>{service.value.tax === "Taxable" ? "": "(Non Taxable)"}</small>
                                                                            </span>{" "}
                                                                            <br />
                                                                            <span className="text-muted">
                                                                                <small>{service.value.description}</small>
                                                                            </span>{" "}
                                                                            <br />
                                                                        </td>
                                                                        <td>${service.value.price}</td>
                                                                        <td>{service.value.quantity}</td>
                                                                        <td>${service.value.total_price}</td>
                                                                    </tr>
                                                                ))}
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
                <AddCustomer showModal={showCustomerModal} modalState={setShowCustomerModal} handleCustomerChange={handleCustomerChange} setCustomersOptions={setCustomersOptions} />
                <AddVehicleReceipt showModal={showVehilcleModal} modalState={setShowVehilcleModal} customer={selectedCustomer} handleVehicleChange={handleVehicleChange} setVehiclesOptions={setVehiclesOptions} />
                {lastSelectedService && <SelectedService showModal={showServiceModal} modalState={setShowServiceModal} lastService={lastSelectedService} setSelectedServices={setSelectedServices} selectedServices={selectedServices} setLastSelectedService={setLastSelectedService} />}
            </div>
        </div>
    );
}