import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const usePermissions = () => {
    const [perms, setPerms] = useState([]);
    const current_url = useLocation();
    const link = current_url.pathname;
    useEffect(() => {
        const permissions = JSON.parse(localStorage.getItem('permissions'));
        if (permissions) {
            const perm = permissions.find(permission => permission.tab_link === link);
            setPerms(perm);
        }
        // eslint-disable-next-line
    }, []);

    return perms;
}

export { usePermissions };