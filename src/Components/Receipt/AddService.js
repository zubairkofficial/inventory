import { useState, useReducer } from "react";
import Helpers from "../../Config/Helpers";
import Modal from "../Modal";
import Input from "../Input";
import SelectInput from "../SelectInput";
import Button from "../Button";
import { customerReducer } from "../../Reducers/CustomerReducer";
import axios from "axios";
import $ from 'jquery'

const AddService = ({ showModal = false, modalState, handleCustomerChange, setCustomersOptions }) => {
    let customerInit = {
        name: "",
        email: "",
        phone: "",
        address: "",
        company_name: "",
        tax: "Taxable",
        taxValue: "6.75",
        user_id: Helpers.authParentId,
    };
    const options =  [
        {label:"Choose Tax Option", value:'', is_disabled: true},
        {label:"Taxable", value:'Taxable', is_disabled: false},
        {label:"Non Taxable", value:'Non Taxable', is_disabled: false},
    ];
    const [customer, setCustomer] = useState(customerInit);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [reucerCustomer, dispatch] = useReducer(customerReducer, customerInit);

    const handleSaveCustomer = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const addOrUpdate = "add";
        axios.post(`${Helpers.baseUrl}customers/${addOrUpdate}`,customer,Helpers.headers).then((response) => {
            let selectedCustomer = {
              label: response.data.name + " (" + response.data.phone + ")",
              value: response.data,
            };
            handleCustomerChange(selectedCustomer);
            // setSelectedCustomer(selectedCustomer);
            dispatch({ type: 'getCustomers', states: { setCustomersOptions } })
            modalState(false);
            $('.modal-backdrop').hide();
            setCustomer(customerInit);
            Helpers.toast("success", "Customer saved successfully");
            setIsLoading(false);
          })
          .catch((error) => {
            setErrors(Helpers.error_response(error));
            setIsLoading(false);
            // setIsCustomerModelVisible(false)
          });
    };
    return (
        <Modal show={showModal} showModalState={modalState} modalId={"AddServiceModal"} modalTitle={"Add New Customer"} >
            <Input label={"Customer Name"} placeholder={"Customer Name"} error={errors.name} value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
            <Input label={"Company Name"} placeholder={"Company Name"} error={errors.company_name} value={customer.company_name} onChange={e => setCustomer({ ...customer, company_name: e.target.value })} />
            <Input label={"Phone"} placeholder={"Phone"} error={errors.phone} value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
            <Input label={"Email"} placeholder={"Email"} error={errors.email} value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} />
            <Input label={"Address"} placeholder={"Address"} error={errors.address} value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
            <SelectInput label={"Tax Status"} value={customer.tax} error={errors.tax} options={options} onChange={e => {
                    setCustomer({ ...customer, tax: e.target.value });
            }} />
            <Button text={"Save"} isLoading={isLoading} color={"success"} onClick={handleSaveCustomer} fullWidth={true} />
        </Modal>
    )
}

export default AddService;