import Login from "./Screens/Auth/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "./Screens/Dashboard";
import Layout from "./Screens/Layouts/AppLayout";
import Customers from "./Screens/Customers";

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
          <Route path="/user/customers" element={<Auth><Customers/></Auth>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
