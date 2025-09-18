import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import {useEffect, useState} from "react";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig.jsx";
import IncomeList from "../components/IncomeList.jsx";
import Modal from "../components/Modal.jsx";
import {Plus} from "lucide-react";
import AddIncomeForm from "../components/AddIncomeForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import IncomeOverview from "../components/IncomeOverview.jsx";

const Income = () => {
    useUser();
    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

// Fetch income details from the API
    const fetchIncomeDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            if (response.status === 200) {
                setIncomeData(response.data);
            }
        }catch(error) {
            console.error('Failed to fetch income details:', error);
            toast.error(error.response?.data?.message || "Failed to fetch income details");
        }finally {
            setLoading(false);
        }
    }

    // Fetch categories for income
    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) {
                console.log('income categories', response.data);
                setCategories(response.data);
            }
        }catch(error) {
            console.log('Failed to fetch income categories:', error);
            toast.error(error.data?.message || "Dështoi marrja e kategorive të të ardhurave");
        }
    }


    //save the income details
    const handleAddIncome = async (income) => {
        const {name, amount, date, icon, categoryId} = income;

        //validation
        if (!name.trim()) {
            toast.error("Ju lutem, shkruani një emër");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Shuma duhet të jetë një numër i vlefshëm më i madh se 0");
            return;
        }

        if (!date) {
            toast.error("Ju lutem, zgjidhni një datë");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            toast.error('Data nuk mund të jetë në të ardhmen');
            return;
        }

        if (!categoryId) {
            toast.error("Ju lutem, zgjidhni një kategori");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId,
            })
            if (response.status === 201) {
                setOpenAddIncomeModal(false);
                toast.success("E ardhura u shtua me sukses");
                fetchIncomeDetails();
                fetchIncomeCategories();
            }
        }catch(error){
            console.log('Error adding income', error);
            toast.error(error.response?.data?.message || "Dështoi shtimi i të ardhurave");
        }

    }

    //delete income details
    const deleteIncome = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            setOpenDeleteAlert({show: false, data: null});
            toast.success("E ardhura u fshi me sukses");
            fetchIncomeDetails();
        }catch(error) {
            console.log('Error deleting income', error);
            toast.error(error.response?.data?.message || "Dështoi fshirja e të ardhurës");
        }
    }


        useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories();
    }, []);


    return(
        <Dashboard activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        {/* overview for income with line char */}
                        <IncomeOverview transactions={incomeData} onAddIncome={() => setOpenAddIncomeModal(true)} />
                    </div>

                        <IncomeList
                            transactions={incomeData}
                            onDelete={(id) => setOpenDeleteAlert({show:true, data: id})}
                        />

                    {/* Add Income Modal */}
                    <Modal
                        isOpen={openAddIncomeModal}
                        onClose={() => setOpenAddIncomeModal(false)}
                        title="Regjistro të ardhura"
                    >
                        <AddIncomeForm
                            onAddIncome={(income) => handleAddIncome(income)}
                            categories={categories}
                        />
                    </Modal>

                    {/* Delete Income Modal */}
                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({show: false, data: null})}
                        title="Fshi të ardhurat"
                    >
                        <DeleteAlert
                            content="A jeni i sigurt që doni të fshini këto të dhëna për të ardhurat?"
                            onDelete={() => deleteIncome(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    )
}

export default Income;