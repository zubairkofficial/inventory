import { useState } from "react";
import Helpers from "../Config/Helpers";
import IconButton from "./IconButton";
import Input from "./Input";

export default function CardHeader({ setState, data, fields }){
    const [query, setQuery] = useState('');
    const handleSearch = e => {
        e.preventDefault();
        setState(Helpers.search(query, data, fields))
    }
    const cancelSearch = e => {
        e.preventDefault();
        setState(data);
        setQuery('');
    }
    return (
        <div className="row" style={{ justifyContent: "center", alignItems: "center" }}>
            <div className="col-7">
                <h3>All Customers</h3>
            </div>
            <div className="col-5">
                <form>
                    <div className="row">
                        <div className="col-8">
                            <Input value={query} placeholder={"Seach here..."} onChange={e => setQuery(e.target.value)} />
                        </div>
                        <div className={ query ? "col-2" : "col-4" }>
                            <IconButton icon={"search-outline"} text={query ? null : "Search"} color={"success"} onClick={handleSearch} topMartgin={false} />
                        </div>
                        {query && <div className="col-2">
                            <IconButton icon={"close"} color={"warning"} onClick={cancelSearch} topMartgin={false} />
                        </div>}
                    </div>
                </form>
            </div>
        </div>
    )
}