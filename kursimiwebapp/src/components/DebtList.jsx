import { Layers2, Pencil, Trash2, Download, Mail, LoaderCircle, Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";

const DebtList = ({ debts, onDelete, onEdit, onDownload, onEmail }) => {
    const [loading, setLoading] = useState(false);

    const handleEmail = async () => {
        setLoading(true);
        try {
            await onEmail();
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        setLoading(true);
        try {
            await onDownload();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <h5 className="text-lg">Lista e Borxheve</h5>
                </div>
                <div className="flex items-center justify-end gap-2">

                    {/* Butoni "Dërgo në email" */}
                    <button disabled={loading} className="card-btn" onClick={handleEmail}>
                        {loading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin"/>
                                Duke dërguar në email...
                            </>
                        ) : (
                            <>
                                <Mail size={15} className="text-base" />
                                Dërgo në email
                            </>
                        )}
                    </button>
                    {/* Butoni "Shkarko" */}
                    <button disabled={loading} className="card-btn" onClick={handleDownload}>
                        {loading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin"/>
                                Duke shkarkuar…
                            </>
                        ) : (
                            <>
                                <Download size={15} className="text-base" />
                                Shkarko
                            </>
                        )}
                    </button>
                </div>
            </div>

            {debts.length === 0 ? (
                <p className="text-gray-500">
                    Ende nuk ke borxhe. Shto disa për të filluar!
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {debts.map((debt) => (
                        <div
                            key={debt.id}
                            className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100/60"
                        >
                            {/* Icon display*/}
                            <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
                                <Layers2 className="text-blue-600" size={24} />
                            </div>

                            {/* Debt Details*/}
                            <div className="flex-1 flex items-center justify-between">
                                {/* Debt name and amounts*/}
                                <div>
                                    <p className="text-sm text-gray-700 font-medium">
                                        {debt.name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1 capitalize">
                                        {debt.type} - {moment(debt.dueDate).format("Do MMM YYYY")}
                                    </p>
                                    <p className="text-sm font-semibold mt-1">
                                        {debt.remainingAmount.toLocaleString('sq-AL', { style: 'currency', currency: 'EUR' })}
                                        <span className="text-xs font-normal text-gray-500"> nga {debt.originalAmount.toLocaleString('sq-AL', { style: 'currency', currency: 'EUR' })}</span>
                                    </p>
                                </div>
                                {/* Action buttons*/}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(debt)}
                                        className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(debt.id)}
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

export default DebtList;