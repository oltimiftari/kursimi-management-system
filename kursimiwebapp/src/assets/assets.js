import logo from "./logo.png";
import login_bg from "./login_bg.png";
import logo2 from "./logo2.png";
import {
    Coins,
    FunnelPlus,
    GoalIcon,
    HandCoinsIcon,
    HatGlassesIcon,
    LayoutDashboard,
    List,
    ShoppingBagIcon,
    Wallet
} from "lucide-react";

export const assets = {
    logo,
    login_bg,
    logo2,
}

export const SIDE_BAR_DATA = [
    {
        id: "01",
        label: "Paneli Kryesor",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Kategoritë",
        icon: List,
        path: "/category",
    },
    {
        id: "03",
        label: "Të Ardhurat",
        icon: Wallet,
        path: "/income",
    },
    {
        id: "04",
        label: "Shpenzimet",
        icon: Coins,
        path: "/expense",
    },
    {
        id: "05",
        label: "Borxhet",
        icon: HandCoinsIcon,
        path: "/debts",
    },
    {
        id: "06",
        label: "Investimet",
        icon: HatGlassesIcon,
        path: "/investments",
    },
    {
        id: "07",
        label: "Abonimet",
        icon: ShoppingBagIcon,
        path: "/subscriptions",
    },
    {
        id: "08",
        label: "Qëllimet",
        icon: GoalIcon,
        path: "/goals",
    },
    {
        id: "09",
        label: "Zgjedh Filtërat",
        icon: FunnelPlus,
        path: "/filter",
    },
];