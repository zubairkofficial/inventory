import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Helpers from "../../Config/Helpers";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../Components/Datatable";
import AddRole from "../../Includes/Roles/AddRole";
import { usePermissions } from "../../Hooks/usePermissions";
import PageTitle from "../../Components/PageTitle";
import ActionButton from "../../Components/ActionButton";

function Roles() {
  const permissions = usePermissions();
  const addRoleRef = useRef(null);

  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [roles, setRoles] = useState([]);
  const [perms, setPerms] = useState([]);

  let navigate = useNavigate();
  const getRoles = () => {
    axios
      .get(`${Helpers.baseUrl}roles/all/${Helpers.authParentId}`, Helpers.headers)
      .then((response) => {
        setRoles(response.data.reverse());
      })
      .catch((error) => {
        Helpers.unauthenticated(error, navigate);
      });
  };

  const hanldeEdit = (roleToEdit) => {
    addRoleRef.current.handleEdit(roleToEdit);
  };

  const handleDelete = (roleId) => {
    Helpers.confirmBox(`${Helpers.baseUrl}roles/delete/${roleId}`, navigate, getRoles);
  };

  useEffect(() => {
    getRoles();
    setPerms(permissions);
  }, []);

  return (
    <div className="page-content">
        <div className="container-fluid">
            <PageTitle title={"Roles & Permissions"} />
            <div className="row">
                <div className="col-8">
                    <div className="card">
                        <div className="card-body border-bottom">
                            <div className="row" style={{ justifyContent: "center", alignItems: "center" }}>
                                <div className="col-9">
                                    <h3>
                                        <img src="/images/icons/roles.png" alt="home" style={{height:30, marginRight:10}} /> All Roles
                                    </h3>
                                </div>
                                <div className="col-3">
                                    <label>Search</label>
                                    <input
                                    className="form-control"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DataTable
                                columns={[
                                    "Sr. #",
                                    "Role Name",
                                    "Manage Permissions",
                                    "Actions",
                                ]}
                            >
                            {roles.map((role, index) => {
                                return (
                                <tr key={role._id}>
                                    <td>{index + 1}</td>
                                    <td>{role.name}</td>
                                    <td>
                                        {
                                            parseInt(perms.can_update) === 1 || Helpers.authUser.user_role == null ?
                                            <Link to={`/user/manage-permissions/${role.name}/${role._id}`} className="btn btn-warning btn-sm">Manage Permissions</Link> : null
                                        }
                                    </td>
                                    <td>
                                        {
                                            (parseInt(perms.can_update) === 1 || Helpers.authUser.user_role == null) && 
                                            <ActionButton icon={"create-outline"} color={"success"} onClick={() => hanldeEdit(role)} />
                                        }
                                        {
                                            (parseInt(perms.can_delete) === 1 || Helpers.authUser.user_role == null) &&
                                            <ActionButton icon={"trash-outline"} color={"danger"} onClick={() => handleDelete(role._id)} />
                                        }
                                    </td>
                                </tr>
                                );
                            })}
                            </DataTable>
                            {roles.length === 0 && <div className="text-center">No data available to display</div>}
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    {(parseInt(perms.can_create) === 1 || Helpers.authUser.user_role == null || (parseInt(perms.can_update) === 1 && isEditing)) && <AddRole getRoles={getRoles} ref={addRoleRef} />}
                </div>
            </div>
        </div>
    </div>
  );
}

export default Roles;
