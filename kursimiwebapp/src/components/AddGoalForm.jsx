import { useEffect, useState } from "react";
import Input from "./Input.jsx";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";

const AddGoalForm = ({ onAddGoal, initialGoalData, isEditing }) => {
    const [goal, setGoal] = useState({
        goalName: '',
        targetAmount: '',
        savedAmount: '',
        endDate: '',
        icon: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && initialGoalData) {
            setGoal(initialGoalData);
        } else {
            setGoal({
                goalName: '',
                targetAmount: '',
                savedAmount: '',
                endDate: '',
                icon: '',
            });
        }
    }, [isEditing, initialGoalData]);

    const handleChange = (key, value) => {
        setGoal({ ...goal, [key]: value });
    };

    const handleSubmit = async () => {
        // Validimet
        if (!goal.goalName.trim()) {
            toast.error("Ju lutem, shkruani një emër për objektivin");
            return;
        }

        if (!goal.targetAmount || isNaN(Number(goal.targetAmount)) || Number(goal.targetAmount) <= 0) {
            toast.error("Shuma e objektivit duhet të jetë një numër i vlefshëm më i madh se 0");
            return;
        }

        if (goal.savedAmount && (isNaN(Number(goal.savedAmount)) || Number(goal.savedAmount) < 0)) {
            toast.error("Shuma e kursyer duhet të jetë një numër i vlefshëm ose 0");
            return;
        }

        if (!goal.endDate) {
            toast.error("Ju lutem, zgjidhni një datë të përfundimit");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (goal.endDate < today) {
            toast.error('Data e përfundimit nuk mund të jetë në të kaluarën');
            return;
        }

        setLoading(true);
        try {
            await onAddGoal(goal);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <EmojiPickerPopup
                icon={goal.icon}
                onSelect={(selectedEmoji) => handleChange('icon', selectedEmoji)}
            />

            <Input
                value={goal.goalName}
                onChange={({ target }) => handleChange('goalName', target.value)}
                label="Emri i Objektivit"
                placeholder="p.sh., Fondi për Pushime"
                type="text"
            />
            <Input
                value={goal.targetAmount}
                onChange={({ target }) => handleChange('targetAmount', target.value)}
                label="Shuma e Objektivit (€)"
                placeholder="p.sh., 1500.00"
                type="number"
            />
            <Input
                value={goal.savedAmount}
                onChange={({ target }) => handleChange('savedAmount', target.value)}
                label="Shuma e Kursyer (€)"
                placeholder="p.sh., 500.00"
                type="number"
            />
            <Input
                value={goal.endDate}
                onChange={({ target }) => handleChange('endDate', target.value)}
                label="Data e Përfundimit"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="add-btn add-btn-fill"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            {isEditing ? "Duke përditësuar..." : "Duke shtuar..."}
                        </>
                    ) : (
                        <>
                            {isEditing ? "Përditëso Objektivin" : "Shto Objektiv"}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddGoalForm;