import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";

const Category = () => {
    useUser();

    return (
        <Dashboard activeMenu="Category">
            This is Category page
        </Dashboard>
    )
}

export default Category;