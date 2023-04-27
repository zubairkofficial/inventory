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
          <Route path="/user/profile-settings" element={<Auth><ProfileSettings /></Auth>} />
          <Route path="/user/roles" element={<Auth><Roles /></Auth>} />
          <Route path="/user/manage-permissions/:role_name/:role_id" element={<Auth><Permissions /></Auth>} />
          <Route path="/user/teams" element={<Auth><Team /></Auth>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
