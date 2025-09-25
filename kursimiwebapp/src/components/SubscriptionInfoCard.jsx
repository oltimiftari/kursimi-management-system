import React from "react";
import { Trash2, TrendingDown, TrendingUp, CreditCard } from "lucide-react";
import { addThousandsSeparator } from "../util/util.js";
import { motion } from "framer-motion";

const SubscriptionInfoCard = ({ name, date, amount, onDelete, icon }) => {
    return(
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60"
        >
            <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full bg-gray-100">
                {React.createElement(icon, {size: 25, className: "text-gray-600"})}
            </div>

            <div className="flex-1 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-700 font-medium">{name}</p>
                    <p className="text-xs text-gray-400 mt-1">{date}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onDelete}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <Trash2 size={18} />
                    </button>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 text-red-800">
                        <h6 className="text-xs font-medium">
                            - {addThousandsSeparator(amount)}
                        </h6>
                        <TrendingDown size={15} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SubscriptionInfoCard;