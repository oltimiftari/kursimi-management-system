import logo from "./logo.png";
import login_bg from "./login_bg.png";
import logo2 from "./logo2.png";
import {Coins, FunnelPlus, GoalIcon, LayoutDashboard, List, Wallet} from "lucide-react";

export const assets = {
    logo,
    login_bg,
    logo2,
}

export const SIDE_BAR_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Category",
        icon: List,
        path: "/category",
    },
    {
        id: "03",
        label: "Income",
        icon: Wallet,
        path: "/income",
    },
    {
        id: "04",
        label: "Expense",
        icon: Coins,
        path: "/expense",
    },
    {
        id: "05",
        label: "Goals",
        icon: GoalIcon,
        path: "/goals",
    },
    {
        id: "06",
        label: "Filters",
        icon: FunnelPlus,
        path: "/filter",
    },
];