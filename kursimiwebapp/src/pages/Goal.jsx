import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import {useEffect, useState} from "react";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig.jsx";
import Modal from "../components/Modal.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import GoalList from "../components/GoalList.jsx";
import AddGoalForm from "../components/AddGoalForm.jsx";


const Goal = () => {
    useUser();
    const [goalData, setGoalData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddGoalModal, setOpenAddGoalModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    // Funksioni per te marre te dhenat e objektivave nga API
    const fetchGoalDetails = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GOALS);
            if (response.status === 200) {
                setGoalData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch goal details:', error);
            toast.error(error.response?.data?.message || "Dështoi marrja e detajeve të objektivave");
        } finally {
            setLoading(false);
        }
    };

    // Funksioni per te shtuar nje objektiv
    const handleAddGoal = async (goal) => {
        const { goalName, targetAmount, savedAmount, endDate, icon } = goal;

        // Validimet
        if (!goalName.trim()) {
            toast.error("Ju lutem, shkruani një emër për objektivin");
            return;
        }

        if (!targetAmount || isNaN(targetAmount) || Number(targetAmount) <= 0) {
            toast.error("Shuma e objektivit duhet të jetë një numër i vlefshëm më i madh se 0");
            return;
        }

        if (savedAmount && (isNaN(savedAmount) || Number(savedAmount) < 0)) {
            toast.error("Shuma e kursyer duhet të jetë një numër i vlefshëm më i madh ose i barabartë me 0");
            return;
        }

        if (!endDate) {
            toast.error("Ju lutem, zgjidhni një datë të përfundimit");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (endDate < today) {
            toast.error('Data e përfundimit nuk mund të jetë në të kaluarën');
            return;
        }

        try {
            await axiosConfig.post(API_ENDPOINTS.GOALS, {
                goalName,
                targetAmount: Number(targetAmount),
                savedAmount: Number(savedAmount || 0),
                endDate,
                icon,
            });

            setOpenAddGoalModal(false);
            toast.success("Objektivi u shtua me sukses");
            fetchGoalDetails();
        } catch (error) {
            console.error('Error adding goal:', error);
            toast.error(error.response?.data?.message || "Dështoi shtimi i objektivit");
        }
    };

    // Funksioni per te fshire nje objektiv
    const deleteGoal = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_GOAL(id));
            setOpenDeleteAlert({show: false, data: null});
            toast.success("Objektivi u fshi me sukses");
            fetchGoalDetails();
        } catch (error) {
            console.error('Error deleting goal:', error);
            toast.error(error.response?.data?.message || "Dështoi fshirja e objektivit");
        }
    };

    useEffect(() => {
        fetchGoalDetails();
    }, []);

    return(
        <Dashboard activeMenu="Qëllimet">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <GoalList
                            goals={goalData}
                            onAddGoal={() => setOpenAddGoalModal(true)}
                            onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                            loading={loading}
                        />
                    </div>
                    <Modal
                        isOpen={openAddGoalModal}
                        onClose={() => setOpenAddGoalModal(false)}
                        title="Shto Objektiv Kursimi"
                    >
                        <AddGoalForm onAddGoal={handleAddGoal} />
                    </Modal>
                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({show: false, data: null})}
                        title="Fshi Objektivin"
                    >
                        <DeleteAlert
                            content="A jeni i sigurt qe doni te fshini kete objektiv?"
                            onDelete={() => deleteGoal(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    );
};

export default Goal;