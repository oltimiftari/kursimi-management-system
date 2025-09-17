import Menubar from "./Menubar.jsx";
import {useContext} from "react";
import {AppContext} from "../context/AppContext.jsx";
import Sidebar from "./Sidebar.jsx";


const Dashboard = () => {
    const {user} = useContext(AppContext);

    return (
        <div>
            <Menubar />

            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        <Sidebar />
                    </div>

                    <div className="grow mx-5">Right side content</div>
                </div>
            )}
        </div>
    )
}

export default Dashboard;