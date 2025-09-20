import {useEffect, useState} from "react";
import Input from "./Input.jsx";
import {LoaderCircle} from "lucide-react";

const AddDebtForm = ({onAddDebt, initialDebtData, isEditing}) => {
    const [debt, setDebt] = useState({
        name: "",
        originalAmount: "",
        remainingAmount: "",
        interestRate: "",
        type: "Personal", // Vlera e paracaktuar
        dueDate: "",
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && initialDebtData) {
            setDebt(initialDebtData);
        } else {

            setDebt({
                name: "",
                originalAmount: "",
                remainingAmount: "",
                interestRate: "",
                type: "Personal",
                dueDate: "",
            });
        }
    }, [isEditing, initialDebtData]);

    const debtTypeOptions = [
        {value: "Personal", label: "Personal"},
        {value: "Credit Card", label: "Kartë Krediti"},
        {value: "Bank Loan", label: "Huasë Bankare"},
        {value: "Other", label: "Tjetër"},
    ]

    const handleChange = (key, value) => {
        setDebt({...debt, [key]: value})
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddDebt(debt);
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4">
            <Input
                value={debt.name}
                onChange={({target}) => handleChange("name", target.value)}
                label="Emri i Borxhit"
                placeholder="p.sh., Kredia e Shtëpisë, Kredi për Veturë, Borxh Personal"
                type="text"
            />
            <Input
                value={debt.originalAmount}
                onChange={({target}) => handleChange("originalAmount", target.value)}
                label="Shuma Fillestare (€)"
                placeholder="p.sh., 5000.00"
                type="number"
            />
            <Input
                value={debt.remainingAmount}
                onChange={({target}) => handleChange("remainingAmount", target.value)}
                label="Shuma e Mbetur (€)"
                placeholder="p.sh., 2500.00"
                type="number"
            />
            <Input
                value={debt.interestRate}
                onChange={({target}) => handleChange("interestRate", target.value)}
                label="Norma e Interesit (%)"
                placeholder="p.sh., 12.5"
                type="number"
            />
            <Input
                label="Tipi i Borxhit"
                value={debt.type}
                onChange={({target}) => handleChange("type", target.value)}
                isSelect={true}
                options={debtTypeOptions}
            />
            <Input
                value={debt.dueDate}
                onChange={({target}) => handleChange("dueDate", target.value)}
                label="Data e Shlyerjes"
                type="date"
            />
            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="add-btn add-btn-fill">
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin"/>
                            {isEditing ? "Duke përditësuar..." : "Duke shtuar..."}
                        </>
                    ): (
                        <>
                            {isEditing ? "Përditëso Borxhin" : "Shto Borxh"}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddDebtForm;