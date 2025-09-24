import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {useUser} from "../hooks/useUser.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import Dashboard from "../components/Dashboard.jsx";
import ExpenseOverview from "../components/ExpenseOverview.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import Modal from "../components/Modal.jsx";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";

const Expense = () => {
    useUser();
    const navigate = useNavigate();
    const [expenseData, setExpenseData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    // Get All Expense Details
    const fetchExpenseDetails = async () => {
        if (loading) return; // Prevent multiple fetches if already loading

        setLoading(true);

        try {
            const response = await axiosConfig.get(
                `${API_ENDPOINTS.GET_ALL_EXPENSE}`
            );

            if (response.data) {
                setExpenseData(response.data);
            }
        } catch (error) {
            console.error("Nuk u morën detajet e shpenzimeve:", error);
            toast.error("Nuk u morën detajet e shpenzimeve.");
        } finally {
            setLoading(false);
        }
    };

    // New: Fetch Expense Categories
    const fetchExpenseCategories = async () => {
        try {
            const response = await axiosConfig.get(
                API_ENDPOINTS.CATEGORY_BY_TYPE("expense") // Fetch categories of type 'expense'
            );
            if (response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Nuk u morën kategoritë e shpenzimeve:", error);
            toast.error("Nuk u morën kategoritë e shpenzimeve.");
        }
    };


    // Handle Add Expense
    const handleAddExpense = async (expense) => {
        const { name, categoryId, amount, date, icon } = expense;

        if (!name.trim()) {
            toast.error("Vendosni një emër për të vazhduar.");
            return;
        }

        // Validation Checks
        if (!categoryId) { // Validate categoryId now
            toast.error("Zgjidhni një kategori për të vazhduar");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Shuma duhet të jetë një numër i vlefshëm më i madh se 0.");
            return;
        }

        if (!date) {
            toast.error("Fusha e datës nuk mund të jetë bosh.");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            toast.error('Data nuk mund të jetë në të ardhmen');
            return;
        }

        try {
            await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
                name,
                categoryId,
                amount: Number(amount),
                date,
                icon,
            });

            setOpenAddExpenseModal(false);
            toast.success("Shpenzimi u shtua me sukses");
            fetchExpenseDetails();
            fetchExpenseCategories();
        } catch (error) {
            console.error(
                "Gabim gjatë shtimit të shpenzimit:",
                error.response?.data?.message || error.message
            );
            toast.error(error.response?.data?.message || "Shtimi i shpenzimit dështoi.");
        }
    };

    // Delete Expense
    const deleteExpense = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Detajet e shpenzimit u fshinë me sukses.");
            fetchExpenseDetails();
        } catch (error) {
            console.error(
                "Gabim gjatë fshirjes së shpenzimit:",
                error.response?.data?.message || error.message
            );
            toast.error(error.response?.data?.message || "Fshirja e shpenzimit dështoi.");
        }
    };

    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(
                API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD,
                {
                    responseType: "blob",
                }
            );


            let filename = "expense_details.xlsx"; // Default filename

            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click(); // Programmatically click the link to trigger download
            link.parentNode.removeChild(link); // Clean up the link element
            window.URL.revokeObjectURL(url); // Release the object URL

            toast.success("Detajet e shpenzimeve u shkarkuan me sukses!");
        } catch (error) {
            console.error("Gabim gjatë shkarkimit të detajeve të shpenzimeve:", error);
            toast.error("Dështoi shkarkimi i detajeve të shpenzimeve. Ju lutemi, provoni përsëri.");
        }
    };

    const handleEmailExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);
            if(response.status === 200) {
                toast.success("Emaili u dërgua me sukses");
            }
        }catch (e) {
            console.error("Gabim gjatë dërgimit të emailit me detajet e shpenzimit:", e);
            toast.error("Emaili me detajet e shpenzimit nuk u dërgua. Ju lutemi provoni përsëri.");
        }
    }

    useEffect(() => {
        fetchExpenseDetails();
        fetchExpenseCategories();
    }, []);

    return (
        <Dashboard activeMenu="Shpenzimet">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div className="">
                        <ExpenseOverview
                            transactions={expenseData}
                            onExpenseIncome={() => setOpenAddExpenseModal(true)}
                        />
                    </div>

                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id) => {
                            setOpenDeleteAlert({ show: true, data: id });
                        }}
                        onDownload={handleDownloadExpenseDetails}
                        onEmail={handleEmailExpenseDetails}
                    />

                    <Modal
                        isOpen={openAddExpenseModal}
                        onClose={() => setOpenAddExpenseModal(false)}
                        title="Shto Shpenzim"
                    >
                        {/* Pass the fetched expense categories to the AddExpenseForm */}
                        <AddExpenseForm
                            onAddExpense={handleAddExpense}
                            categories={categories}
                        />
                    </Modal>

                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                        title="Fshi Shpenzim"
                    >
                        <DeleteAlert
                            content="A jeni i sigurt që doni të fshini këtë shpenzim?"
                            onDelete={() => deleteExpense(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    );
};

export default Expense;