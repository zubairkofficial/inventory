import axios from "axios";
import Button from "../../Components/Button"
import { useEffect, useState } from "react";
import Helpers from "../../Config/Helpers";
import Input from "../../Components/Input";
import { useNavigate } from "react-router-dom";

export default function AddTax({setShowTax}){
    let taxValueInit = {tax: 0};
    const [taxValue, setTaxValue] = useState(taxValueInit);
    const [errors, setErrors] = useState({});
    const [btnLoading, setBtnLoading] = useState(false);
    let navigate = useNavigate();
    const handleSaveTax = (e) => {
        e.preventDefault();
        setBtnLoading(true);
        if((taxValue.tax % 1 === 0 || taxValue.tax % 1 !== 0)  && taxValue.tax > 0 && taxValue.tax < 100){
          axios.post(
              `${Helpers.baseUrl}customers/update-tax`,
              taxValue,
              Helpers.headers
            )
            .then((response) => {
              getTax();
              Helpers.toast("success", "Tax updated successfully");
              setBtnLoading(false);
              setShowTax(false);
            })
            .catch((error) => {
              setErrors(Helpers.error_response(error));
              setBtnLoading(false);
            });
        }else{
          Helpers.toast("error", "Invalid tax value");
          setBtnLoading(false);
        }
    };
    const getTax = () => {
        axios.get(`${Helpers.baseUrl}customers/get-tax/${Helpers.authParentId}`, Helpers.headers).then((response) => {
            if (response.data != null) {
                setTaxValue(response.data);
            }
        }).catch((error) => {
            Helpers.unauthenticated(error, navigate);
        });
    };

    useEffect(() => {
        getTax();
        // eslint-disable-next-line
    }, []);
    return (
        <div className="card">
            <div className="card-header">
                <h5>
                Tax Percentage for Taxable Customers
                </h5>
            </div>
            <div className="card-body border-bottom">
                <form>
                    <Input label={"Tax Value (In %)"} placeholder={"Tax Value"} error={errors.tax} value={taxValue.tax} onChange={e => {
                        setTaxValue({...taxValue, tax:e.target.value, user_id:Helpers.authParentId})
                    }} />
                    <div className="row">
                        <div className="col-6">
                            <Button text={"Save Tax"} color={"success"} onClick={handleSaveTax} fullWidth={true} isLoading={btnLoading} />
                        </div>
                        <div className="col-6">
                            <Button text={"Cancel"} color={"danger"} onClick={() => setShowTax(false)} fullWidth={true} isLoading={btnLoading} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}