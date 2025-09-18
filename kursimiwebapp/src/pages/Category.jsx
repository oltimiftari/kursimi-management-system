import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import {Plus} from "lucide-react";
import CategoryList from "../components/CategoryList.jsx";
import {useEffect, useState} from "react";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import axiosConfig from "../util/axiosConfig.jsx";
import Modal from "../components/Modal.jsx";
import AddCategoryForm from "../components/AddCategoryForm.jsx";
import toast from "react-hot-toast";

const Category = () => {

    useUser();
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);


        const fetchCategoryDetails = async () => {
        if(loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                console.log('categories',response.data);
                setCategoryData(response.data);
            }
        }catch(error) {
            console.error('Something went wrong. Please try again.', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    const handleAddCategory = async (category) => {
        const {name, type, icon} = category;

        if(!name.trim()) {
            toast.error("Emri i kategorisë është i nevojshëm");
            return;
        }

        //check if the category already exists
        const isDuplicate = categoryData.some((category) => {
            return category.name.toLowerCase() === name.trim().toLowerCase();
        })

        if (isDuplicate) {
            toast.error("Emri i kategorisë ekziston tashmë");
            return;
        }

        try {
           const response = await  axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {name, type, icon});
           if(response.status === 201) {
               toast.success("Kategoria u shtua me sukses");
               setOpenAddCategoryModal(false);
               fetchCategoryDetails();
           }
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error(error.response?.data?.message || "Gabim gjatë shtimit të kategorisë");
        }
    }

    const handleEditCategory = (categoryToEdit) => {
        setSelectedCategory(categoryToEdit);
        setOpenEditCategoryModal(true);
    }
    const handleUpdateCategory = async (updatedCategory) => {
        const {id, name, type, icon} = updatedCategory;
        if (!name.trim()) {
            toast.error("Emri i kategorisë është i nevojshëm");
            return;
        }

        if (!id) {
            toast.error("D-ja e kategorisë mungon për përditësim.");
            return;
        }

        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {name, type, icon});
            setOpenEditCategoryModal(false);
            setSelectedCategory(null);
            toast.success("Kategoria u përditësua me sukses");
            fetchCategoryDetails();
        }catch(error) {
            console.error('Error updating category:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Përditësimi i kategorisë dështoi.");
        }
    }

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY(categoryId));
            toast.success("Kategoria u fshi me sukses");
            fetchCategoryDetails(); // rifreskon listën
        } catch (error) {
            console.error("Error deleting category:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Fshirja e kategorisë dështoi");
        }
    };



    return (
        <Dashboard activeMenu="Category">
            <div className="my-5 mx-auto">
                {/* Add button to add category*/}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-semibold">Lista e Kategorive</h2>
                    <button
                        onClick={() => setOpenAddCategoryModal(true)}
                        className="add-btn flex items-center gap-1">
                        <Plus size={15} />
                        Shto Kategori
                    </button>
                </div>

                {/* Category list */}
                <CategoryList categories={categoryData} onEditCategory={handleEditCategory} onDeleteCategory={handleDeleteCategory}/>

                {/* Adding category modal*/}
                <Modal
                    isOpen={openAddCategoryModal}
                    onClose={() => setOpenAddCategoryModal(false)}
                    title="Shto një Kategori"
                >
                    <AddCategoryForm onAddCategory={handleAddCategory}/>
                </Modal>

                {/* Updating category modal*/}
                <Modal
                    onClose={() =>{
                        setOpenEditCategoryModal(false);
                        setSelectedCategory(null);
                    }}
                    isOpen={openEditCategoryModal}
                    title="Përditëso kategorinë"
                >

                    <AddCategoryForm
                        initialCategoryData={selectedCategory}
                        onAddCategory={handleUpdateCategory}
                        isEditing={true}
                    />
                </Modal>
            </div>
        </Dashboard>
    )
}

export default Category;