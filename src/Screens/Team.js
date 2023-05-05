import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Helpers from "../Config/Helpers";
import { useNavigate } from "react-router-dom";
import DataTable from "../Components/Datatable";
import AddTeamMember from "../Includes/Team/AddTeam";
import { usePermissions } from "../Hooks/usePermissions";
import CardHeader from "../Components/CardHeader";
import PageTitle from "../Components/PageTitle";
import { useTitle } from "../Hooks/useTitle";
import ActionButton from "../Components/ActionButton";

function Team() {
    const addTeamMemberRef = useRef(null);
    const permissions = usePermissions();
    console.log(permissions);
    useTitle("Team Management");

    const [teams, setTeams] = useState([]);
    const [data, setData] = useState([]);
    const [perms, setPerms] = useState([]);


    let navigate = useNavigate();
    const getTeams = () => {
        axios.get(`${Helpers.baseUrl}teams/${Helpers.authParentId}`, Helpers.headers).then((response) => {
            setTeams(response.data.reverse());
            setData(response.data);
        })
        .catch((error) => {
            Helpers.unauthenticated(error, navigate);
        });
    };

    const hanldeEdit = (teamToEdit) => {
        addTeamMemberRef.current.handleEdit(teamToEdit);
    };

    const handleDelete = (teamId) => {
        Helpers.confirmBox(`${Helpers.baseUrl}teams/delete/${teamId}`, navigate, getTeams)
    };

    useEffect(() => {
        getTeams();
        setPerms(permissions);
        // eslint-disable-next-line
    }, []);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <PageTitle title={"Team Management"} />
        <div className="row">
          <div className="col-8">
            <div className="card">
              <div className="card-body border-bottom">
                <CardHeader title={"Team Management"} data={data} fields={["name", "email", "user_role.name"]} setState={setTeams} />
                <DataTable
                  columns={["Sr. #", "Name", "Email", "Role", "Actions"]}
                >
                  {teams.map((team, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{team.name}</td>
                        <td>{team.email}</td>
                        <td>{team.user_role ? team.user_role.name : ""}</td>
                        <td>
                          {
                            (parseInt(perms.can_update) === 1 || Helpers.authUser.user_role == null) &&
                            <ActionButton icon={"create-outline"} color={"success"} onClick={() => hanldeEdit(team)} />
                          }
                          
                          {
                            (parseInt(perms.can_delete) === 1 || Helpers.authUser.user_role == null) &&
                            <ActionButton icon={"trash-outline"} color={"danger"} onClick={() => handleDelete(team._id)} />
                          }
                        </td>
                      </tr>
                    );
                  })}
                </DataTable>
                {teams.length === 0 ? (
                  <div className="text-center">
                    No data available to display
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="col-4">
            {
              (perms.can_create === 1 || Helpers.authUser.user_role == null || (parseInt(perms.can_update) === 1)) &&
               <AddTeamMember getTeams={getTeams} ref={addTeamMemberRef} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Team;
