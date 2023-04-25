import { useEffect, useState } from "react";

const useTitle = title => {
    const [docTitle] = useState(title);
    useEffect(() => {
        document.title = docTitle;
    }, [docTitle]);

    return docTitle;
}

export { useTitle };