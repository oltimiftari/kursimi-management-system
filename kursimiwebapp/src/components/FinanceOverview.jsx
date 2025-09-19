import CustomPieChart from "./CustomPieChart.jsx";
import {addThousandsSeparator} from "../util/util.js";

const FinanceOverview = ({totalBalance, totalIncome, totalExpense}) => {
    const COLORS = ["#FFB22C", "#DC3C22", "#06923E"];

    const balanceData = [
        { name: "Bilanci Total", amount: totalBalance },
        { name: "Shpenzime Totale", amount: totalExpense },
        { name: "Të Ardhura Totale", amount: totalIncome },
    ];
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Përmbledhje e Financave</h5>
            </div>

            <CustomPieChart
                data={balanceData}
                label="Bilanci Total"
             totalAmount={addThousandsSeparator(totalBalance)}
                colors={COLORS}
                showTextAnchor
            />
        </div>
    )
}

export default FinanceOverview;