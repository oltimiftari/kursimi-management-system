import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import axiosConfig from "../util/axiosConfig.jsx";
import Modal from "../components/Modal.jsx";
import toast from "react-hot-toast";
import DeleteAlert from "../components/DeleteAlert.jsx";
import AddDebtForm from "../components/AddDebtForm.jsx";
import DebtList from "../components/DebtList.jsx";

const Debt = () => {
    useUser();
    const [loading, setLoading] = useState(false);
    const [debtData, setDebtData] = useState([]);
    const [openAddDebtModal, setOpenAddDebtModal] = useState(false);
    const [openEditDebtModal, setOpenEditDebtModal] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState(null);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });


    const fetchDebtDetails = async () => {
        if(loading) return;
        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.DEBTS);
            if (response.status === 200) {
                setDebtData(response.data);
            }
        }catch(error) {
            console.error('Something went wrong. Please try again.', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDebtDetails();
    }, []);

    const handleAddDebt = async (debt) => {
        try {
            const response = await  axiosConfig.post(API_ENDPOINTS.DEBTS, debt);
            if(response.status === 201) {
                toast.success("Borxhi u shtua me sukses");
                setOpenAddDebtModal(false);
                fetchDebtDetails();
            }
        } catch (error) {
            console.error('Error adding debt:', error);
            toast.error(error.response?.data?.message || "Gabim gjatë shtimit të borxhit");
        }
    }

    const handleEditDebt = (debtToEdit) => {
        setSelectedDebt(debtToEdit);
        setOpenEditDebtModal(true);
    }

    const handleUpdateDebt = async (updatedDebt) => {
        const {id} = updatedDebt;

        if (!id) {
            toast.error("ID-ja e borxhit mungon për përditësim.");
            return;
        }

        try {
            await axiosConfig.put(API_ENDPOINTS.DEBT_BY_ID(id), updatedDebt);
            setOpenEditDebtModal(false);
            setSelectedDebt(null);
            toast.success("Borxhi u përditësua me sukses");
            fetchDebtDetails();
        }catch(error) {
            console.error('Error updating debt:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Përditësimi i borxhit dështoi.");
        }
    }

    //delete debt
    const deleteDebt = async (debtId) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DEBT_BY_ID(debtId));
            setOpenDeleteAlert({show: false, data: null});
            toast.success("Borxhi u fshi me sukses");
            fetchDebtDetails();
        }catch(error) {
            console.log('Error deleting debt', error);
            toast.error(error.response?.data?.message || "Dështoi fshirja e borxhit");
        }
    }

    const handleDownloadReport = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.DOWNLOAD_DEBTS, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'debts_report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Raporti u shkarkua me sukses!");
        } catch (error) {
            console.error("Gabim gjate shkarkimit te raportit:", error);
            toast.error("Dështoi shkarkimi i raportit.");
        }
    };

    const handleEmailReport = async () => {
        try {
            await axiosConfig.post(API_ENDPOINTS.EMAIL_DEBTS);
            toast.success("Raporti u dërgua në emailin tuaj!");
        } catch (error) {
            console.error("Gabim gjate dergimit te emailit:", error);
            toast.error("Dështoi dërgimi i emailit.");
        }
    };

    return (
        <Dashboard activeMenu="Borxhet">
            <div className="my-5 mx-auto">
                <div className="flex justify-end mb-4">
                    <button className="add-btn" onClick={() => setOpenAddDebtModal(true)}>
                        <Plus size={15} />
                        Shto Borxh
                    </button>
                </div>

                <DebtList
                    debts={debtData}
                    onDelete={deleteDebt}
                    onEdit={handleEditDebt}
                    onDownload={handleDownloadReport}
                    onEmail={handleEmailReport}
                />

                <Modal
                    isOpen={openAddDebtModal}
                    onClose={() => setOpenAddDebtModal(false)}
                    title="Shto një Borxh"
                >
                    <AddDebtForm onAddDebt={handleAddDebt}/>
                </Modal>

                <Modal
                    onClose={() =>{
                        setOpenEditDebtModal(false);
                        setSelectedDebt(null);
                    }}
                    isOpen={openEditDebtModal}
                    title="Përditëso borxhin"
                >
                    <AddDebtForm
                        initialDebtData={selectedDebt}
                        onAddDebt={handleUpdateDebt}
                        isEditing={true}
                    />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({show: false, data: null})}
                    title="Fshi borxhin"
                >
                    <DeleteAlert
                        content="A jeni i sigurt që doni të fshini këtë borxh?"
                        onDelete={() => deleteDebt(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </Dashboard>
    );
};

export default Debt;