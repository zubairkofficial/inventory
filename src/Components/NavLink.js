import { Link } from "react-router-dom";

export default function NavLink({ icon, text, link }){
    return (
        <li className="nav-item">
            <Link className="nav-link menu-link" to={link}>
                <img
                    src={`/images/icons/${icon}`}
                    alt={text}
                    style={{ height: 15, marginRight: 10 }}
                />
                <span data-key="t-widgets">{text}</span>
            </Link>
        </li>
    );
}