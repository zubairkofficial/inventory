import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PageTitle from "../Components/PageTitle";
import StatsCount from "../Components/StatsCount";
import { useTitle } from "../Hooks/useTitle"
import axios from "axios";
import Helpers from "../Config/Helpers";
import TodayReceipts from "../Includes/Dashboard/TodayReceipts";
import TodayCustomers from "../Includes/Dashboard/TodayCustomers";

export default function Home(){
    useTitle("Dashboard");
    const [receipts, setReceipts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    let navigate = useNavigate();

    const getData = () => {
        let today = Helpers.currentDate();
        axios.get(`${Helpers.baseUrl}reports/daily/${today}/${Helpers.authParentId}`, Helpers.headers).then((response) => {
          setReceipts(response.data.receipts.reverse() );
          setCustomers(response.data.customers.reverse());
          setVehicles(response.data.vehicles.reverse());
        }).catch((error) => {
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
        getData();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="page-content">
            <div className="container-fluid">
                <PageTitle title={"Dashboard"} />
                <div className="row">
                    <div className="col-xxl-3 col-md-6">
                        <StatsCount value={customers.length} title={"Customers Today"} />
                    </div>
                    <div className="col-xxl-3 col-md-6">
                        <StatsCount value={vehicles.length} title={"Vehicles Today"} />
                    </div>
                    <div className="col-xxl-3 col-md-6">
                        <StatsCount value={receipts.length} title={"Receipts Today"} />
                    </div>
                    <div className="col-xxl-3 col-md-6">
                        <StatsCount value={`$${calcPrice(receipts)}`} title={"Sale Today"} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <TodayReceipts receipts={receipts} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <TodayCustomers customers={customers} />
                    </div>
                </div>
            </div>
        </div>
    )
}