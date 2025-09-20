import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import {useEffect, useState} from "react";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import axiosConfig from "../util/axiosConfig.jsx";
import Modal from "../components/Modal.jsx";
import toast from "react-hot-toast";
import InvestmentList from "../components/InvestmentList.jsx";
import AddInvestmentForm from "../components/AddInvestmentForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import {Plus} from "lucide-react";

const Investments = () => {

    useUser();
    const [loading, setLoading] = useState(false);
    const [investmentData, setInvestmentData] = useState([]);
    const [openAddInvestmentModal, setOpenAddInvestmentModal] = useState(false);
    const [openEditInvestmentModal, setOpenEditInvestmentModal] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState(null);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const fetchInvestmentDetails = async () => {
        if(loading) return;
        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.INVESTMENTS);
            if (response.status === 200) {
                setInvestmentData(response.data);
            }
        }catch(error) {
            console.error('Something went wrong. Please try again.', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInvestmentDetails();
    }, []);

    const handleAddInvestment = async (investment) => {
        try {
            const response = await  axiosConfig.post(API_ENDPOINTS.INVESTMENTS, investment);
            if(response.status === 201) {
                toast.success("Investimi u shtua me sukses");
                setOpenAddInvestmentModal(false);
                fetchInvestmentDetails();
            }
        } catch (error) {
            console.error('Error adding investment:', error);
            toast.error(error.response?.data?.message || "Gabim gjatë shtimit të investimit");
        }
    }

    const handleEditInvestment = (investmentToEdit) => {
        setSelectedInvestment(investmentToEdit);
        setOpenEditInvestmentModal(true);
    }

    const handleUpdateInvestment = async (updatedInvestment) => {
        const {id} = updatedInvestment;

        if (!id) {
            toast.error("ID-ja e investimit mungon për përditësim.");
            return;
        }

        try {
            await axiosConfig.put(API_ENDPOINTS.INVESTMENTS, updatedInvestment);
            setOpenEditInvestmentModal(false);
            setSelectedInvestment(null);
            toast.success("Investimi u përditësua me sukses");
            fetchInvestmentDetails();
        }catch(error) {
            console.error('Error updating investment:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Përditësimi i investimit dështoi.");
        }
    }

    const deleteInvestment = async (investmentId) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.INVESTMENT_BY_ID(investmentId));
            setOpenDeleteAlert({show: false, data: null});
            toast.success("Investimi u fshi me sukses");
            fetchInvestmentDetails();
        }catch(error) {
            console.log('Error deleting investment', error);
            toast.error(error.response?.data?.message || "Dështoi fshirja e investimit");
        }
    }

    return (
        <Dashboard activeMenu="Investimet">
            <div className="my-5 mx-auto">
                <div className="flex justify-end mb-4">
                    <button onClick={() => setOpenAddInvestmentModal(true)} className="add-btn">
                    <Plus size={15}/>
                        Shto Investim</button>
                </div>
                <InvestmentList
                    investments={investmentData}
                    onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                    onEdit={handleEditInvestment}
                />

                {/* Adding investment modal*/}
                <Modal
                    isOpen={openAddInvestmentModal}
                    onClose={() => setOpenAddInvestmentModal(false)}
                    title="Shto një Investim"
                >
                    <AddInvestmentForm onAddInvestment={handleAddInvestment}/>
                </Modal>

                {/* Updating investment modal*/}
                <Modal
                    onClose={() =>{
                        setOpenEditInvestmentModal(false);
                        setSelectedInvestment(null);
                    }}
                    isOpen={openEditInvestmentModal}
                    title="Përditëso investimin"
                >
                    <AddInvestmentForm
                        initialInvestmentData={selectedInvestment}
                        onAddInvestment={handleUpdateInvestment}
                        isEditing={true}
                    />
                </Modal>

                {/* Delete investment modal */}
                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({show: false, data: null})}
                    title="Fshi investimin"
                >
                    <DeleteAlert
                        content="A jeni i sigurt që doni të fshini këtë investim?"
                        onDelete={() => deleteInvestment(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </Dashboard>
    )
}

export default Investments;