import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
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
    // Shtojmë state-in e ri për modalin e editimit dhe objektivin e përzgjedhur
    const [openEditGoalModal, setOpenEditGoalModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

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

    const handleAddGoal = async (goal) => {
        // Logjika e validimit është e njëjtë, prandaj mund ta lëmë siç është
        const { goalName, targetAmount, savedAmount, endDate, icon } = goal;

        if (!goalName.trim() || !targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0 || !endDate) {
            toast.error("Ju lutem plotësoni fushat e detyrueshme me vlera të vlefshme.");
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

    const openEditModal = (goal) => {
        setSelectedGoal(goal);
        setOpenEditGoalModal(true);
    };


    const handleUpdateGoal = async (updatedGoal) => {
        const handleUpdateGoal = async (updatedGoal) => {
            const { id } = updatedGoal;
            console.log("Objektivi që po dërgohet për përditësim:", updatedGoal);
            console.log("ID-ja e objektivit:", id);
        }
        const { id } = updatedGoal;
        if (!id) {
            toast.error("ID-ja e objektivit mungon për përditësim.");
            return;
        }

        // Logjika e validimit për përditësim
        if (!updatedGoal.goalName.trim() || !updatedGoal.targetAmount || isNaN(Number(updatedGoal.targetAmount)) || Number(updatedGoal.targetAmount) <= 0 || !updatedGoal.endDate) {
            toast.error("Ju lutem plotësoni fushat e detyrueshme me vlera të vlefshme.");
            return;
        }

        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_GOAL(id), updatedGoal);
            setOpenEditGoalModal(false);
            setSelectedGoal(null);
            toast.success("Objektivi u përditësua me sukses");
            fetchGoalDetails();
        } catch (error) {
            console.error('Error updating goal:', error);
            toast.error(error.response?.data?.message || "Dështoi përditësimi i objektivit");
        }
    };

    const deleteGoal = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_GOAL(id));
            setOpenDeleteAlert({ show: false, data: null });
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

    return (
        <Dashboard activeMenu="Qëllimet">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <GoalList
                            goals={goalData}
                            onAddGoal={() => setOpenAddGoalModal(true)}
                            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                            onEdit={openEditModal} // Kalojmë funksionin e ri për editim
                            loading={loading}
                        />
                    </div>
                    {/* Modali i shtimit */}
                    <Modal
                        isOpen={openAddGoalModal}
                        onClose={() => setOpenAddGoalModal(false)}
                        title="Shto Objektiv Kursimi"
                    >
                        <AddGoalForm onAddGoal={handleAddGoal} />
                    </Modal>

                    {/* Modali i ri i editimit */}
                    <Modal
                        isOpen={openEditGoalModal}
                        onClose={() => {
                            setOpenEditGoalModal(false);
                            setSelectedGoal(null);
                        }}
                        title="Përditëso objektivin"
                    >
                        <AddGoalForm
                            isEditing={true}
                            initialGoalData={selectedGoal}
                            onAddGoal={handleUpdateGoal}
                        />
                    </Modal>

                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
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