export default function TabPermission({ tab, checked, handleCheck, handleCheckPers }){
    return (
        <div className="card">
            <div className="card-header bg-light">
                <div
                className="form-check-outline form-check-success"
                style={{ fontSize: "18px" }}
                >
                <input
                    className="form-check-input m-2"
                    id={tab._id}
                    type="checkbox"
                    value={`${tab.tab_link}`}
                    onChange={handleCheck}
                    checked={checked.checked_tabs.includes(`${tab.tab_link}`)}

                />
                <label
                    className="form-check-label m-1"
                    htmlFor={tab._id}
                >
                    Allow {tab.tab_name}
                </label>
                </div>
            </div>
            <div className="card-body">
                <div
                className="form-check-outline form-check-success form-check-inline"
                style={{ fontSize: "16px" }}
                >
                <input
                    className="form-check-input m-2"
                    type="checkbox"
                    id={`${tab._id}-add`}
                    value={`${tab.tab_link}-add`}
                    checked={checked.checked_pers.includes(`${tab.tab_link}-add`)}
                    onChange={handleCheckPers}
                />
                <label
                    className="form-check-label m-1"
                    htmlFor={`${tab._id}-add`}
                >
                    Add
                </label>
                </div>
                <div
                className="form-check-outline form-check-success form-check-inline"
                style={{ fontSize: "16px" }}
                >
                <input
                    className="form-check-input m-2"
                    type="checkbox"
                    id={`${tab._id}-update`}
                    value={`${tab.tab_link}-update`}
                    checked={checked.checked_pers.includes(`${tab.tab_link}-update`)}
                    onChange={handleCheckPers}

                />
                <label
                    className="form-check-label m-1"
                    htmlFor={`${tab._id}-update`}
                >
                    Update
                </label>
                </div>
                <div
                className="form-check-outline form-check-success form-check-inline"
                style={{ fontSize: "16px" }}
                >
                <input
                    className="form-check-input m-2"
                    type="checkbox"
                    id={`${tab._id}-delete`}
                    value={`${tab.tab_link}-delete`}
                    onChange={handleCheckPers}
                    checked={checked.checked_pers.includes(`${tab.tab_link}-delete`)}
                    

                />
                <label
                    className="form-check-label m-1"
                    htmlFor={`${tab._id}-delete`}
                >
                    Delete
                </label>
                </div>
            </div>
        </div>
    );
}