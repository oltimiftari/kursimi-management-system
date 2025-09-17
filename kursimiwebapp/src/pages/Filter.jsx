import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";

const Filter = () => {
    useUser();
    return(
        <Dashboard activeMenu="Filters">
            This is filter page
        </Dashboard>
    )
}

export default Filter;