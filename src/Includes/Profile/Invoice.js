import React, {useState} from 'react'
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import axios from "axios";
import Helpers from "../../Config/Helpers";

export default function Invoice() {
    const storedData = localStorage.getItem('user');
    let invoiceInit = {
        new_invoice: JSON.parse(storedData).invoice,
    };
    const [invoice, setinvoice] = useState(invoiceInit);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveinvoice = (e) => {
        e.preventDefault();
        setIsLoading(true);
        let data = invoice;
        data._id = Helpers.authUser._id;
        // setinvoice({ ...invoice, _id: Helpers.authUser._id });
        axios.post(`${Helpers.baseUrl}users/update-invoice`, data, Helpers.headers).then((response) => {
            // setinvoice(invoiceInit);
            // setinvoice({ ...invoiceInit, new_invoice: "" });
            Helpers.toast("success", "invoice Updated successfully");
            setIsLoading(false);
            setErrors({});
        }).catch((error) => {
            Helpers.toast("error", error.response.data.message);
            setErrors(Helpers.error_response(error));
            setIsLoading(false);
        });
    };

  return (
    <div className="card">
    <div className="card-header">
        <h5>
            Update Invoice
        </h5>
    </div>
    <div className="card-body border-bottom">
        <form>
            <Input type="number" value={invoice.new_invoice} error={errors.new_invoice} label={"New invoice"} placeholder={"New invoice"} onChange={(e) =>
                setinvoice({  ...invoice, new_invoice: e.target.value })
            } />
            <Button text={"Update invoice"} isLoading={isLoading} onClick={handleSaveinvoice} color={"success"} fullWidth={false} />
        </form>
    </div>
</div>
  )
}
