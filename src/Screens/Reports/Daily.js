import { useState, useEffect } from "react";
import axios from "axios";
import Helpers from "../../Config/Helpers";
import {useNavigate, useLocation } from "react-router-dom";
import { immediateToast } from "izitoast-react";
import "izitoast-react/dist/iziToast.css";
import { useTitle } from "../../Hooks/useTitle";
import { usePermissions } from "../../Hooks/usePermissions";
import ReportIcon from "../../Components/ReportIcon";

function DailyReports() {
    useTitle("Todays Reports");
  const current_url = useLocation();

  const [report, setReport] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicle] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceCount, setServiceCount] = useState({});
  const [dealersSale, setDealersSale] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [netSale, setNetSale] = useState(0);
  const [cardPayment, setCardPayment] = useState(0);
  const [cashPayment, setCashPayment] = useState(0);
  const [checkPayment, setCheckPayment] = useState(0);
  const [todayRemaining, setTodayRemaining] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const user_id = Helpers.authParentId;
  const [allReceipts, setAllReceipts] = useState([]);

  let navigate = useNavigate();
  const getAllReceipts = () => {
    axios
      .get(`${Helpers.baseUrl}receipts/all/${Helpers.authParentId}`, Helpers.headers)
      .then((response) => {
        setAllReceipts(response.data.reverse());
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };

  const calcTotalRemaining = () => {
    var sum = allReceipts.reduce(function(acc, receipt) {
      acc += receipt.remaining;
      return acc;
    }, 0);
    setTotalRemaining(sum);
  };

  const getServices = () => {
    axios
      .get(`${Helpers.baseUrl}services/all/${Helpers.authParentId}`, Helpers.headers)
      .then((response) => {
        setServices(response.data.reverse());
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };

  const countServices = () => {
    // console.log('receipts>>>',receipts);
    let count = {}
    if (receipts.length > 0) {
      count = receipts.map(receipt => receipt.services).reduce((acc, service)=>{
        service.map(item =>{
            acc[item.value._id] = (acc[item.value._id]||0)+1;
        });
        // count[label] = (count[label] ||0)+1;
        // console.log(label, '>>>');
        return acc;
      }, {});      
    }

    // console.log('services count>>>',count);
    setServiceCount(count);
  };

  const salesToDealers = () => {
    if (receipts.length > 0) {
    var sum = receipts.reduce(function(acc, receipt) {
      if (receipt.customer.tax === 'Non Taxable') {
          acc += receipt.totalPrice;
      }
      return acc;
  }, 0);
    setDealersSale(sum);
    }
  };

  const calcTotalDiscount = () =>{
    let total_discount = receipts.reduce((acc, receipt) => acc + receipt.discount, 0);
    setTotalDiscount(total_discount)
  };

  const calcTotalTax = () =>{
    let total_tax = receipts.reduce((acc, receipt) => acc + receipt.tax, 0);
    setTotalTax(total_tax)
  };

  const calcNetSale = () =>{
    let net_sale = receipts.reduce((acc, receipt) => acc + receipt.totalPrice, 0);
    setNetSale(net_sale)
  };

  const calcCardPayment = () => {
    let cardReceipts = receipts.filter(receipt => receipt.paymentType === "Card");
    let total_price = cardReceipts.reduce((acc, receipt) => acc + receipt.totalPrice, 0);
    setCardPayment(total_price);
  };

  const calcCashPayment = () => {
    let CashReceipts = receipts.filter(receipt => receipt.paymentType === "Cash");
    let total_price = CashReceipts.reduce((acc, receipt) => acc + receipt.totalPrice, 0);
    setCashPayment(total_price);
  };

  const calcCheckPayment = () => {
    let CheckReceipts = receipts.filter(receipt => receipt.paymentType === "Check");
    let total_price = CheckReceipts.reduce((acc, receipt) => acc + receipt.totalPrice, 0);
    setCheckPayment(total_price);
  };

  const todayTotalRemaining = () =>{
    let notPaidReceipts = receipts.filter(receipt => receipt.status !== "Paid");
    let total_remaining = notPaidReceipts.reduce((acc, receipt) => acc + receipt.remaining, 0);
    setTodayRemaining(total_remaining);
    // console.log('');
  }

  const getReport = () => {
    let today = Helpers.currentDate();
    axios
      .get(`${Helpers.baseUrl}reports/daily/${today}/${Helpers.authParentId}`, Helpers.headers)
      .then((response) => {
        setReport(response.data);
        setReceipts(response.data.receipts.reverse() );
        setCustomers(response.data.customers.reverse());
        setVehicle(response.data.vehicles.reverse());
      })
      .catch((error) => {
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
    getReport();
    getServices();
    getAllReceipts();
  }, []);
  
  useEffect(() => {
    calcTotalRemaining();
  }, [allReceipts]);

  useEffect(() => {
    countServices();
    salesToDealers();
    calcTotalDiscount();
    calcTotalTax();
    calcNetSale();
    calcCardPayment();
    calcCashPayment();
    calcCheckPayment();
    todayTotalRemaining();
  }, [receipts]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Today's Report</h4>
            </div>
          </div>
        </div>
        <div className="row">
            <ReportIcon iconUrl={"https://cdn.lordicon.com/imamsnbq.json"} text={'Customers'} number={customers.length} />
            <ReportIcon iconUrl={"https://cdn.lordicon.com/uetqnvvg.json"} text={'Vehicles'} number={vehicles.length} />
            <ReportIcon iconUrl={"https://cdn.lordicon.com/nocovwne.json"} text={'Receipts Generated'} number={receipts.length} />
            <ReportIcon iconUrl={"https://cdn.lordicon.com/qhviklyi.json"} text={'Total Sale'} number={`$${calcPrice(receipts)}`} />
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h2>Today's Report {new Date().toJSON().slice(0, 10)}</h2>
              </div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <th>Service</th>
                    <th>Total Numbers</th>
                    <th>Total Sales</th>
                  </thead>
                  <tbody>
                    {
                      services.map((service, index)=>{
                        return(
                          <tr key={service._id}>
                            <td>{service.service_name}</td>
                            <td>{serviceCount[service._id] ?? 0}</td>
                            <td>$ {(serviceCount[service._id] ?? 0) * service.price}</td>
                          </tr>
                        )
                      })
                    }
                    <tr>
                      <td>Total Sales to Non-Taxable Customers</td>
                      <td>---</td>
                      <td>$ {dealersSale}</td>
                    </tr>
                    <tr>
                      <td>Total Discounts</td>
                      <td>---</td>
                      <td>$ {totalDiscount}</td>
                    </tr>
                    <tr>
                      <td>Total Tax</td>
                      <td>---</td>
                      <td>$ {totalTax}</td>
                    </tr>
                    <tr>
                      <td>Gross Sales</td>
                      <td>---</td>
                      <td>$ {netSale - totalDiscount - totalTax}</td>
                    </tr>
                    <tr>
                      <td>Net Sales</td>
                      <td>---</td>
                      <td>$ {netSale}</td>
                    </tr>
                    <tr>
                      <td>Total Paid w/ Cash</td>
                      <td>---</td>
                      <td>$ {cashPayment}</td>
                    </tr>
                    <tr>
                      <td>Total Paid w/ Card</td>
                      <td>---</td>
                      <td>$ {cardPayment}</td>
                    </tr>
                    <tr>
                      <td>Total Paid w/ Check</td>
                      <td>---</td>
                      <td>$ {checkPayment}</td>
                    </tr>
                    <tr>
                      <td>Today Total Owed (Fleet Accounts)</td>
                      <td>---</td>
                      <td>$ {todayRemaining}</td>
                    </tr>
                    <tr>
                      <td>Total Owed (Fleet Accounts)</td>
                      <td>---</td>
                      <td>$ {totalRemaining}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyReports;
