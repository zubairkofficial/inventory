import { useState, forwardRef, useImperativeHandle } from "react";
import Input from "../../Components/Input";
import Helpers from "../../Config/Helpers";
import SelectInput from "../../Components/SelectInput";
import Button from "../../Components/Button";
import axios from "axios";

const AddCustomer = forwardRef(({ allCustomers }, ref) => {
    let customerInit = {
        name: "",
        email: "",
        phone: "",
        address: "",
        company_name:"",
        tax:"",
        taxValue:0,
        user_id:Helpers.authParentId,
    };
    const options =  [
        {label:"Choose Tax Option", value:'', is_disabled: true},
        {label:"Taxable", value:'Taxable', is_disabled: false},
        {label:"Non Taxable", value:'Non Taxable', is_disabled: false},
    ];
    const [customer, setCustomer] = useState(customerInit);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveCustomer = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const addOrUpdate = isEditing ? "update" : "add";
        axios.post(
            `${Helpers.baseUrl}customers/${addOrUpdate}`,
            customer,
            Helpers.headers
        ).then((response) => {
            setCustomer(customerInit);
            allCustomers();
            setIsEditing(false);
            setIsLoading(false);
            Helpers.toast("success", "Customer saved successfully");
        }).catch((error) => {
            setErrors(Helpers.error_response(error));
            setIsLoading(false);
        });
    };
    useImperativeHandle(ref, () => ({
        handleEdit(customerToEdit){
            setIsEditing(true);
            setCustomer(customerToEdit);
        }
    }));
    const cancelSaving = () => {
        setIsEditing(false);
        setCustomer(customerInit);
    }

    return (
        <div className="card">
            <div className="card-header">
                <h5>
                    {isEditing
                    ? `Updating "${customer.name}"`
                    : "Add New Customer"}
                </h5>
            </div>
            <div className="card-body border-bottom">
                <Input label={"Customer Name"} value={customer.name} placeholder={"Customer Name"} error={errors.name} onChange={e => {
                    setCustomer({ ...customer, name: e.target.value })
                }} />
                <Input label={"Company Name"} value={customer.company_name} placeholder={"Company Name"} error={errors.company_name} onChange={e => {
                    setCustomer({ ...customer, company_name: e.target.value })
                }} />
                <Input label={"Email"} value={customer.email} placeholder={"Email"} error={errors.email} onChange={e => {
                    setCustomer({ ...customer, email: e.target.value })
                }} />
                <Input label={"Phone"} value={customer.phone} placeholder={"Phone"} error={errors.phone} onChange={e => {
                    setCustomer({ ...customer, phone: e.target.value })
                }} />
                <Input label={"Address"} value={customer.address} placeholder={"Address"} error={errors.address} onChange={e => {
                    setCustomer({ ...customer, address: e.target.value })
                }} />
                <SelectInput label={"Tax Status"} value={customer.tax} error={errors.tax} options={options} onChange={e => {
                    setCustomer({ ...customer, tax: e.target.value });
                }} />
                <div className="row">
                    <div className="col-6">
                        <Button text={"Save Customer"} color={"success"} onClick={handleSaveCustomer} fullWidth={true} isLoading={isLoading} />
                    </div>
                    {isEditing && <div className="col-6">
                        <Button text={"Cancel"} color={"danger"} onClick={cancelSaving} fullWidth={true} />
                    </div>}
                </div>
            </div>
        </div>
    );
})

export default AddCustomer;