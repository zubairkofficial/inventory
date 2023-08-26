import { useState } from "react";
import Helpers from "../Config/Helpers";
import Input from "./Input";

export default function CardHeader({ setState, title, data, fields, paginate = false, setPageNo, description }){
    const [query, setQuery] = useState('');
    const onInputSearch = inputQuery => {
        if(paginate){
            setState(Helpers.paginate(Helpers.search(inputQuery, data, fields)))
            setPageNo(0);
        }else{
            setState(Helpers.search(inputQuery, data, fields))
        }
    }
    const handleSearchChange = e => {
        if(e.target.value === ''){
            if(paginate){
                setState(Helpers.paginate(data));
                setPageNo(0);
            }else{
                setState(data)
            }
        }else{
            onInputSearch(e.target.value);
        }
        setQuery(e.target.value);
    }
    return (
        <div className="row" style={{ justifyContent: "center", alignItems: "center" }}>
            <div className="col-9">
                <h4>{title}</h4>
                {description && <p>{description}</p>}
            </div>
            <div className="col-3">
                <form>
                    <div className="row">
                        <div className="col-12">
                            <Input value={query} placeholder={"Seach here..."} onChange={handleSearchChange} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}