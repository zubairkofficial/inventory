import { useEffect, useState } from "react";
import Helpers from "../Config/Helpers";

const useTitle = title => {
    const [docTitle] = useState(title);
    useEffect(() => {
        document.title = docTitle + " | " + Helpers.appName;
    }, [docTitle]);

    return docTitle;
}

export { useTitle };