import {useEffect, useState} from "react";
import Input from "./Input.jsx";
import {LoaderCircle} from "lucide-react";

const AddInvestmentForm = ({onAddInvestment, initialInvestmentData, isEditing}) => {
    const [investment, setInvestment] = useState({
        assetName: "",
        tickerSymbol: "",
        initialAmount: "",
        sharesOwned: "",
        purchaseDate: "",
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && initialInvestmentData) {
            setInvestment(initialInvestmentData);
        } else {
            setInvestment({
                assetName: "",
                tickerSymbol: "",
                initialAmount: "",
                sharesOwned: "",
                purchaseDate: "",
            });
        }
    }, [isEditing, initialInvestmentData]);

    const handleChange = (key, value) => {
        setInvestment({...investment, [key]: value})
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddInvestment(investment);
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4">
            <Input
                value={investment.assetName}
                onChange={({target}) => handleChange("assetName", target.value)}
                label="Emri i Pasurisë"
                placeholder="p.sh., Aksionet e Apple"
                type="text"
            />
            <Input
                value={investment.tickerSymbol}
                onChange={({target}) => handleChange("tickerSymbol", target.value)}
                label="Simboli"
                placeholder="p.sh., AAPL"
                type="text"
            />
            <Input
                value={investment.initialAmount}
                onChange={({target}) => handleChange("initialAmount", target.value)}
                label="Shuma e Investuar (€)"
                placeholder="p.sh., 1000.00"
                type="number"
            />
            <Input
                value={investment.sharesOwned}
                onChange={({target}) => handleChange("sharesOwned", target.value)}
                label="Numri i Aksioneve"
                placeholder="p.sh., 5.5"
                type="number"
            />
            <Input
                value={investment.purchaseDate}
                onChange={({target}) => handleChange("purchaseDate", target.value)}
                label="Data e Blerjes"
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
                            {isEditing ? "Përditëso Investimin" : "Shto Investim"}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddInvestmentForm;