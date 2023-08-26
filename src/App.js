import Login from "./Screens/Auth/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "./Screens/Dashboard";
import Layout from "./Screens/Layouts/AppLayout";
import Customers from "./Screens/Customers";
import ProfileSettings from "./Screens/ProfileSettings";
import Roles from "./Screens/Roles/Roles";
import Permissions from "./Screens/Roles/Permissions";
import Team from "./Screens/Team";
import Employees from "./Screens/Employess";
import Vehicles from "./Screens/Vehicles";
import Services from "./Screens/Services";
import Tires from './Screens/Tires';
import Oils from "./Screens/Oils";
import Receipts from "./Screens/Receipt/Receipts";
import TodayReceipts from "./Screens/Receipt/TodayReceipts";
import UnpaidReceipts from "./Screens/Receipt/UnpaidReceipts";
import AddReceipt from "./Screens/Receipt/AddReceipt";
import ReceiptDetails from "./Screens/Receipt/ReceiptDetail";
import MakePayment from "./Screens/Receipt/MakePayment";
import Drafts from "./Screens/Receipt/Drafts";
import EditDraft from "./Screens/Receipt/EditDraft";
import DailyReports from "./Screens/Reports/Daily";
import WeeklyReports from "./Screens/Reports/Weekly";
import MonthlyReports from "./Screens/Reports/Monthly";
import AnnuallyReports from "./Screens/Reports/Anually";
import CustomerReceipts from "./Screens/Receipt/CustomerReceipts";

import './App.css';

function Auth({children}){
  let user = localStorage.getItem('user');
  let token = localStorage.getItem('token');
  let timeNow = new Date().getTime();
  let loginTime = localStorage.getItem('timestamp');
  let afterLogin = (timeNow - loginTime) / 1000;
  let totalMinutes = afterLogin / 60;
  if(totalMinutes > 120){
    localStorage.clear();
    return <Navigate to='/' />;
  }else{
    return user && token ? children : <Navigate to='/' />;
  }
}

function AfterAuth({children}){
  let user = localStorage.getItem('user');
  let token = localStorage.getItem('token');
  return !(user && token) ? children : <Navigate to='/user/dashboard' />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<AfterAuth><Login/></AfterAuth>} />
        <Route path="/user" element={<Layout/>}>
          <Route path="/user/dashboard" element={<Auth><Home/></Auth>} />
          <Route path='/user/services' element={<Auth><Services/></Auth>}></Route>
          <Route path='/user/tires' element={<Auth><Tires /></Auth>}></Route>
          <Route path='/user/oils' element={<Auth><Oils /></Auth>}></Route>
          <Route path="/user/customers" element={<Auth><Customers/></Auth>} />
          <Route path="/user/vehicles" element={<Auth><Vehicles/></Auth>} />
          <Route path='/user/receipts' element={<Auth><Receipts /></Auth>}></Route>
          <Route path='/user/receipts/today' element={<Auth><TodayReceipts /></Auth>}></Route>
          <Route path='/user/receipts/unpaid' element={<Auth><UnpaidReceipts /></Auth>}></Route>
          <Route path='/user/receipts/add' element={<Auth><AddReceipt /></Auth>}></Route>
          <Route path='/user/receipts/receipt-details/:receipt_id' element={<Auth><ReceiptDetails /></Auth>}></Route>
          <Route path='/user/unpaid-receipt/make-payment/:receipt_id' element={<Auth><MakePayment /></Auth>}></Route>
          <Route path='/user/drafts' element={<Auth><Drafts /></Auth>}></Route>
          <Route path='/user/receipts/drafts-edit/:receipt_id' element={<Auth><EditDraft /></Auth>}></Route>
          <Route path='/user/reports/daily' element={<Auth><DailyReports /></Auth>}></Route>
          <Route path='/user/reports/weekly' element={<Auth><WeeklyReports /></Auth>}></Route>
          <Route path='/user/reports/monthly' element={<Auth><MonthlyReports /></Auth>}></Route>
          <Route path='/user/reports/annually' element={<Auth><AnnuallyReports /></Auth>}></Route>
          <Route path="/user/profile-settings" element={<Auth><ProfileSettings /></Auth>} />
          <Route path="/user/roles" element={<Auth><Roles /></Auth>} />
          <Route path="/user/manage-permissions/:role_name/:role_id" element={<Auth><Permissions /></Auth>} />
          <Route path="/user/teams" element={<Auth><Team /></Auth>} />
          <Route path='/user/receipts/customer/:customer_name/:customer_id' element={<Auth><CustomerReceipts /></Auth>}></Route>
          <Route path="/user/employees" element={<Auth><Employees /></Auth>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
