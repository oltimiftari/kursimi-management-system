import { useEffect, useState } from "react";
import {Plus} from "lucide-react";
import CustomLineChart from "./CustomLineChart.jsx";
import {prepareIncomeLineChartData} from "../util/util.js";

const ExpenseOverview = ({transactions, onExpenseIncome}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeLineChartData(transactions);
        setChartData(result);

        return () => {};
    }, [transactions]);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div className="">
                    <h5 className="text-lg">Përmbledhje e shpenzimeve</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Ndiq tendencat e shpenzimeve me kalimin e kohës dhe merr njohuri se ku shkojnë paratë e tua.
                    </p>
                </div>

                <button className="add-btn" onClick={onExpenseIncome}>
                    <Plus size={15} className="text-lg" />
                    Shto Shpenzim
                </button>
            </div>

            <div className="mt-10">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    );
};

export default ExpenseOverview;
