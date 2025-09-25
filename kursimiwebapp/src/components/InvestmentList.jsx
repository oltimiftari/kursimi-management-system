import { Layers2, Pencil, Trash2 } from "lucide-react";
import moment from "moment";


const InvestmentList = ({ investments, onDelete, onEdit }) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg">Lista e Investimeve</h5>
            </div>

            {investments.length === 0 ? (
                <p className="text-gray-500">
                    Ende nuk keni investime. Shto disa për të filluar!
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {investments.map((investment) => (
                        <div
                            key={investment.id}
                            className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100/60"
                        >
                            {/* Icon display*/}
                            <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
                                <Layers2 className="text-green-600" size={24} />
                            </div>

                            {/* Investment Details*/}
                            <div className="flex-1 flex items-center justify-between">
                                {/* Investment name and amounts*/}
                                <div>
                                    <p className="text-sm text-gray-700 font-medium">
                                        {investment.assetName}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1 capitalize">
                                        {investment.tickerSymbol} - {moment(investment.purchaseDate).format("Do MMM YYYY")}
                                    </p>
                                    <p className="text-sm font-semibold mt-1">
                                        {investment.initialAmount.toLocaleString('sq-AL', { style: 'currency', currency: 'EUR' })}

                                    </p>
                                </div>
                                {/* Action buttons*/}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(investment)}
                                        className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(investment.id)}
                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InvestmentList;