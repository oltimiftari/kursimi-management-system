import {ArrowRight} from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment";

const RecentTransactions = ({transactions, onMore}) => {
    return(
        <div className="card">
            <div className="flex items-center justify-between">
                <h4 className="text-lg">Transaksionet e fundit</h4>

                <button className="card-btn" onClick={onMore}>
                    Shiko Më Shumë <ArrowRight className="text-base" size={15}/>
                </button>
            </div>

            <div className="mt-6">
                {transactions?.slice(0, 5)?.map((item, index) => (
                    <TransactionInfoCard
                        key={`${item.id}-${index}`}
                        title={item.name}
                        icon={item.icon}
                        date={moment(item.date).format("Do MMM YYYY")}
                        amount={item.amount}
                        type={item.type}
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    )
}

export default RecentTransactions;