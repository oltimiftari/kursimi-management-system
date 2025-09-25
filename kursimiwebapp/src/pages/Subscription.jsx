import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../util/apiEndpoints';
import axiosConfig from '../util/axiosConfig.jsx';
import SubscriptionList from '../components/SubscriptionList';
import AddSubscriptionForm from '../components/AddSubscriptionForm';
import SubscriptionTimeline from '../components/SubscriptionTimeline';
import { useUser } from '../hooks/useUser';
import Dashboard from "../components/Dashboard.jsx";
import Modal from "../components/Modal.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import toast from "react-hot-toast";

const Subscription = () => {
    const userContext = useUser();
    const { user } = userContext;
    const [subscriptions, setSubscriptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    if (!userContext) {
        return <Dashboard activeMenu="Abonimet">
            <div className="flex items-center justify-center h-full">
                <div>Duke ngarkuar të dhënat e përdoruesit...</div>
            </div>
        </Dashboard>;
    }

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await axiosConfig.get(API_ENDPOINTS.SUBSCRIPTIONS);
            setSubscriptions(response.data);
        } catch (error) {
            console.error('Gabim gjatë marrjes së abonimeve:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscriptionCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("subscription"));
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Gabim gjatë marrjes së kategorive të abonimeve:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSubscriptions();
            fetchSubscriptionCategories();
        }
    }, [user]);

    const handleSubscriptionAdded = () => {
        fetchSubscriptions();
        fetchSubscriptionCategories();
    };

    const deleteSubscription = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_SUBSCRIPTION(id));
            setOpenDeleteAlert({ show: false, data: null });
            fetchSubscriptions();
        } catch (error) {
            console.error('Gabim gjatë fshirjes së abonimit:', error);
        }
    };

    const handleEmail = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_SUBSCRIPTION);
            if (response.status === 200) {
                toast.success("Abonimet u dërguan me sukses në email.");
            }
        } catch (error) {
            console.error("Gabim gjatë dërgimit të abonimeve në email.", error);
            toast.error("Dështoi dërgimi i abonimeve në email.");
        }
    }

    const handleDownload = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.SUBSCRIPTION_EXCEL_DOWNLOAD, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "subscriptions.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Skedari u shkarkua me sukses.");
        } catch (error) {
            console.error("Gabim gjatë shkarkimit të skedarit.", error);
            toast.error("Dështoi shkarkimi i skedarit.");
        }
    };

    if (loading) {
        return <Dashboard activeMenu="Abonimet">
            <div className="flex items-center justify-center h-full">
                <div>Duke ngarkuar...</div>
            </div>
        </Dashboard>;
    }

    return (
        <Dashboard activeMenu="Abonimet">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AddSubscriptionForm
                            onSubscriptionAdded={handleSubscriptionAdded}
                            categories={categories}
                        />
                        <SubscriptionTimeline subscriptions={subscriptions} />
                    </div>
                    <SubscriptionList
                        subscriptions={subscriptions}
                        onSubscriptionUpdated={handleSubscriptionAdded}
                        onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                        onEmail={handleEmail}
                        onDownload={handleDownload}
                    />
                </div>
            </div>
            <Modal
                isOpen={openDeleteAlert.show}
                onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                title="Fshi Abonimin"
            >
                <DeleteAlert
                    content="A jeni i sigurt që doni të fshini këtë abonim?"
                    onDelete={() => deleteSubscription(openDeleteAlert.data)}
                />
            </Modal>
        </Dashboard>
    );
};

export default Subscription;