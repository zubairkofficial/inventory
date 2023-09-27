import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PageTitle from "../Components/PageTitle";
import StatsCount from "../Components/StatsCount";
import { useTitle } from "../Hooks/useTitle"
import axios from "axios";
import Helpers from "../Config/Helpers";
import TodayReceipts from "../Includes/Dashboard/TodayReceipts";
import TodayCustomers from "../Includes/Dashboard/TodayCustomers";
import "react-daterange-picker/dist/css/react-calendar.css";
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';

export default function Home(){
    useTitle("Dashboard");
    const [receipts, setReceipts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [ newCustomerCount, setnewCustomerCount ] = useState([]);
    const [newVehicle, setNewVehicle] = useState([]);
    let navigate = useNavigate();
    let today = Helpers.currentDate();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [allReceipts, setAllReceipts] = useState([]);
    const [url, setUrl] = useState(`${Helpers.baseUrl}reports/daily/${today}/${Helpers.authParentId}`)


    const handleDateRangeApply = (event, picker) => {
        let endDate = moment(picker.startDate.toDate()).format('YYYY-MM-DD');
        let startDate = moment(picker.endDate.toDate()).format('YYYY-MM-DD');
    
        const date = moment(picker.endDate.toDate());
        const currentDate = moment();
        const nextDate = moment(currentDate).add(1, 'days');
    
    
        if (!(date.isAfter(nextDate))) {
          setStartDate(endDate)
          setEndDate(startDate)
          setUrl(`${Helpers.baseUrl}reports/weekly/${endDate}/${startDate}/${Helpers.authParentId}`)
        } else {
          Helpers.toast(
            "error",
            "Please select the date before Current date"
          )
        }
      }

    const getData = () => {
        let today = Helpers.currentDate();
        if(startDate && endDate){
            axios
        .get(`${Helpers.baseUrl}reports/weekly/${endDate}/${startDate}/${Helpers.authParentId}`, Helpers.headers).then((response) => {
        // .get(`${url}`, Helpers.headers).then((response) => {
          setReceipts(response.data.receipts.reverse() );


        //   Check if the Customer is New
        let newCustomers = [];
        let uniqueCustomerIds = new Set();
for (let i = 0; i < response.data.receipts.length; i++) {
    const currentTime = moment().format('YYYY-MM-DD');
    let customerTime = moment(response.data.receipts[i].customer.createdAt).format('YYYY-MM-DD');
    if(currentTime==customerTime){
        // newCustomers.push(customerTime)
        if (!uniqueCustomerIds.has(response.data.receipts[i]._id)) {
            // Add the customer ID to the Set if it's not already there
            uniqueCustomerIds.add(response.data.receipts[i]._id);
          }
    }
}
    newCustomers.push(uniqueCustomerIds);
    newCustomers.reverse();

    // newCustomers.reverse();
    setnewCustomerCount(newCustomers);

// Check New Vehicles
// Check if the Vehicle is New
let newVehicles = [];
let uniqueVehicleIds = new Set();

for (let i = 0; i < response.data.receipts.length; i++) {
    const currentTime = moment().format('YYYY-MM-DD');
    let vehicleTime = moment(response.data.receipts[i].vehicle.createdAt).format('YYYY-MM-DD');

    if(currentTime == vehicleTime){
        if (!uniqueVehicleIds.has(response.data.receipts[i]._id)) {
            uniqueVehicleIds.add(response.data.receipts[i]._id);
        }
    }
}

newVehicles.push(uniqueVehicleIds);
newVehicles.reverse();
setNewVehicle(newVehicles);


        //   Customer
        let customers = [];
        for (let i = 0; i < response.data.receipts.length; i++) {
            let customer = response.data.receipts[i].customer;
            let existingCustomer = customers.find(c => c.name === customer.name && c.number === customer.number);
    if (!existingCustomer) {
        customers.push(customer);
    }
        }
        customers.reverse();
        setCustomers(customers);
        
        // Vehicles
        let vehicles = [];
        for (let i = 0; i < response.data.receipts.length; i++) {
            let vehicle = response.data.receipts[i].vehicle;
            let existingVehicle = vehicles.find(c => c.name === vehicle.name && c.model === vehicle.model);
        if (!existingVehicle) {
                vehicles.push(vehicle);
        }
        }
        vehicles.reverse();
        setVehicles(vehicles);

        }).catch((error) => {
            Helpers.unauthenticated(error, navigate); 
        });
        }else{

            axios
            .get(`${Helpers.baseUrl}reports/daily/${today}/${Helpers.authParentId}`, Helpers.headers).then((response) => {
        // .get(`${url}`, Helpers.headers).then((response) => {
          setReceipts(response.data.receipts.reverse() );
        //   Customer
        let customers = [];
        for (let i = 0; i < response.data.receipts.length; i++) {
            let customer = response.data.receipts[i].customer;
            let existingCustomer = customers.find(c => c.name === customer.name && c.number === customer.number);
    if (!existingCustomer) {
        customers.push(customer);
    }
}
customers.reverse();
setCustomers(customers);


// Check New Vehicles
// Check if the Vehicle is New
let newVehicles = [];
let uniqueVehicleIds = new Set();

for (let i = 0; i < response.data.receipts.length; i++) {
    const currentTime = moment().format('YYYY-MM-DD');
    let vehicleTime = moment(response.data.receipts[i].vehicle.createdAt).format('YYYY-MM-DD');

    if(currentTime == vehicleTime){
        if (!uniqueVehicleIds.has(response.data.receipts[i]._id)) {
            uniqueVehicleIds.add(response.data.receipts[i]._id);
        }
    }
}

newVehicles.push(uniqueVehicleIds);
newVehicles.reverse();
setNewVehicle(newVehicles);
   


        // Check New Customers
        //   Check if the Customer is New
        let newCustomers = [];
        let uniqueCustomerIds = new Set();
        for (let i = 0; i < response.data.receipts.length; i++) {
        const currentTime = moment().format('YYYY-MM-DD');
        let customerTime = moment(response.data.receipts[i].customer.createdAt).format('YYYY-MM-DD');
        if(currentTime==customerTime){
        if (!uniqueCustomerIds.has(response.data.receipts[i]._id)) {
            uniqueCustomerIds.add(response.data.receipts[i]._id);
        }
        }
        }
        newCustomers.push(uniqueCustomerIds);
        newCustomers.reverse();
        setnewCustomerCount(newCustomers);


// Vehicles
let vehicles = [];
for (let i = 0; i < response.data.receipts.length; i++) {
    let vehicle = response.data.receipts[i].vehicle;
    let existingVehicle = vehicles.find(c => c.name === vehicle.name && c.model === vehicle.model);
    if (!existingVehicle) {
        vehicles.push(vehicle);
    }
}
vehicles.reverse();
setVehicles(vehicles);

}).catch((error) => {
    Helpers.unauthenticated(error, navigate); 
});
}
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
        // console.log(receipts[0].vehicle.createdAt)
    },[ startDate, endDate]);

    return (
        <div className="page-content">
            <div className="container-fluid">
                <PageTitle title={"Dashboard"} >
                <div className="p-2" style={{
                    float: "right"
                }}>
                <DateRangePicker  onApply={handleDateRangeApply}>
              <button className="btn btn-success">Filter by Date</button>
              </DateRangePicker>
                </div>
                </PageTitle>
                <div className="row">
                    <div className="col-xxl-4 col-md-6">
                        <StatsCount value={newCustomerCount.length} title={"New Customers"} />
                    </div>
                    <div className="col-xxl-4 col-md-6">
                        <StatsCount value={newVehicle.length} title={"New Vehicles"} />
                    </div>
                    <div className="col-xxl-4 col-md-6">
                        <StatsCount value={customers.length} title={"Customers Today"} />
                    </div>
                    <div className="col-xxl-4 col-md-6">
                        <StatsCount value={vehicles.length} title={"Vehicles Today"} />
                    </div>
                    <div className="col-xxl-4 col-md-6">
                        <StatsCount value={receipts.length} title={"Receipts Today"} />
                    </div>
                    <div className="col-xxl-4 col-md-6">
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