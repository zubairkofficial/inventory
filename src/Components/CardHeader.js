import { useState } from "react";
import Helpers from "../Config/Helpers";
import IconButton from "./IconButton";
import Input from "./Input";

export default function CardHeader({ setState, title, data, fields }){
    const [query, setQuery] = useState('');
    const handleSearch = e => {
        e.preventDefault();
        setState(Helpers.search(query, data, fields))
    }
    const onInputSearch = inputQuery => {
        setState(Helpers.search(inputQuery, data, fields))
    }
    const handleSearchChange = e => {
        if(e.target.value === ''){
            setState(data);
        }else{
            onInputSearch(e.target.value);
        }
        setQuery(e.target.value);
    }
    const cancelSearch = e => {
        e.preventDefault();
        setState(data);
        setQuery('');
    }
    return (
        <div className="row" style={{ justifyContent: "center", alignItems: "center" }}>
            <div className="col-7">
                <h3>{title}</h3>
            </div>
            <div className="col-5">
                <form>
                    <div className="row">
                        <div className="col-8">
                            <Input value={query} placeholder={"Seach here..."} onChange={handleSearchChange} />
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