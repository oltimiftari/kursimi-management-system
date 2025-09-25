import { Download, LoaderCircle, Mail, Music, Clapperboard, Globe, CreditCard, Zap } from "lucide-react";
import SubscriptionInfoCard from "./SubscriptionInfoCard.jsx";
import moment from "moment";
import { useState } from "react";

const SubscriptionList = ({ subscriptions, onDelete, onDownload, onEmail }) => {
    const [loading, setLoading] = useState(false);

    const subscriptionIcons = {
        'Netflix': Clapperboard,
        'Spotify': Music,
        'Apple Music': Music,
        'Shpenzime për internet': Globe,
        'Pagesa e kartës së kreditit': CreditCard,
        'Default': Zap
    };

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
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Lista e Abonimeve</h5>
                <div className="flex items-center justify-end gap-2">
                    <button disabled={loading} className="card-btn" onClick={handleEmail}>
                        {loading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                                Duke dërguar në email...
                            </>
                        ) : (
                            <>
                                <Mail size={15} className="text-base" />
                                Dërgo në email
                            </>
                        )}
                    </button>
                    <button disabled={loading} className="card-btn" onClick={handleDownload}>
                        {loading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin" />
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

            <div className="grid grid-cols-1 md:grid-cols-2">
                {subscriptions?.map((subscription) => {
                    const iconName = subscription.name in subscriptionIcons ? subscription.name : 'Default';
                    const IconComponent = subscriptionIcons[iconName];

                    return (
                        <SubscriptionInfoCard
                            key={subscription.id}
                            name={subscription.name}
                            icon={IconComponent}
                            date={moment(subscription.date).format('Do MMM YYYY')}
                            amount={subscription.amount}
                            onDelete={() => onDelete(subscription.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default SubscriptionList;