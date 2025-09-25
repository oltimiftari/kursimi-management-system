import { useState, useEffect } from "react";
import Input from "./Input.jsx";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import axiosConfig from "../util/axiosConfig.jsx";

const AddSubscriptionForm = ({ onSubscriptionAdded, categories }) => {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        frequency: 'MONTHLY',
        paymentDate: '',
        categoryId: '',
    });

    const [loading, setLoading] = useState(false);

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }))

    const handleChange = (key, value) => {
        setFormData({...formData, [key]: value});
    }

    const handleAddSubscription = async () => {
        // Validation
        if (!formData.name.trim()) {
            toast.error("Ju lutem, shkruani një emër");
            return;
        }
        if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
            toast.error("Shuma duhet të jetë një numër i vlefshëm më i madh se 0");
            return;
        }
        if (!formData.paymentDate) {
            toast.error("Ju lutem, zgjidhni një datë");
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        if (formData.paymentDate > today) {
            toast.error('Data nuk mund të jetë në të ardhmen');
            return;
        }
        if (!formData.categoryId) {
            toast.error("Ju lutem, zgjidhni një kategori");
            return;
        }

        setLoading(true);
        try {
            await axiosConfig.post(API_ENDPOINTS.ADD_SUBSCRIPTION, {
                ...formData,
                amount: Number(formData.amount),
            });
            onSubscriptionAdded();
            toast.success("Abonimi u shtua me sukses");
            setFormData({
                name: '',
                amount: '',
                frequency: 'MONTHLY',
                paymentDate: '',
                categoryId: categories.length > 0 ? categories[0].id : '',
            });
        } catch (error) {
            console.error('Error adding subscription', error);
            toast.error(error.response?.data?.message || "Dështoi shtimi i abonimit");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categories.length > 0 && !formData.categoryId) {
            setFormData((prev) => ({...prev, categoryId: categories[0].id}))
        }
    }, [categories, formData.categoryId]);

    return (
        <div className="card">
            <h5 className="text-lg">Shto Abonim të Ri</h5>
            <div>
                <Input
                    label="Emri i Abonimit"
                    placeholder="p.sh., Netflix,Spotify"
                    type="text"
                    value={formData.name}
                    onChange={({target}) => handleChange('name', target.value)}
                />

                <Input
                    label="Shuma"
                    placeholder="p.sh., 15.99"
                    type="number"
                    value={formData.amount}
                    onChange={({target}) => handleChange('amount', target.value)}
                />

                <Input
                    label="Frekuenca"
                    value={formData.frequency}
                    onChange={({target}) => handleChange('frequency', target.value)}
                    isSelect={true}
                    options={[
                        {value: "MONTHLY", label: "Mujore"},
                        {value: "YEARLY", label: "Vjetore"},
                        {value: "WEEKLY", label: "Javore"}
                    ]}
                />

                <Input
                    label="Kategoria"
                    value={formData.categoryId}
                    onChange={({target}) => handleChange('categoryId', target.value)}
                    isSelect={true}
                    options={categoryOptions}
                />

                <Input
                    label="Data e Pagesës"
                    type="date"
                    value={formData.paymentDate}
                    onChange={({target}) => handleChange('paymentDate', target.value)}
                />

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleAddSubscription}
                        disabled={loading}
                        className="add-btn add-btn-fill">
                        {loading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin"/>
                                Duke shtuar…
                            </>
                        ) : (
                            <>
                                Shto Abonimin
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSubscriptionForm;