
import { useState, useEffect } from "react";
import axios from "axios";
import "./Upload.css";

const uploadToys = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCosmetic, setSelectedCosmetic] = useState(null);
    const [cosmetics, setCosmetics] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchCosmetics = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://demo-deployment2-9.onrender.com/admin/toys", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCosmetics(response.data);
        } catch (error) {
            console.error("Error fetching Toys:", error);
            setErrorMessage("Error fetching Toys. Please try again.");
        }
    };

    useEffect(() => {
        fetchCosmetics();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description || qty <= 0 || price <= 0 || !file) {
            alert("All fields are required, and values must be valid!");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Only image files are allowed!");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description.trim());
        formData.append("qty", qty);
        formData.append("price", price);
        formData.append("file", file);

        const token = localStorage.getItem("token");

        try {
            await axios.post("https://demo-deployment2-9.onrender.com/admin/upload/toys", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Toys uploaded successfully!");
            setName("");
            setDescription("");
            setQty(0);
            setPrice(0);
            setFile(null);
            setIsModalOpen(false);
            fetchCosmetics();
        } catch (error) {
            console.error("Error uploading Toys:", error);
            alert(error.response?.data || "An error occurred while uploading the Toys.");
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`https://demo-deployment2-9.onrender.com/admin/delete/toys/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Toys deleted successfully!");
            setCosmetics(cosmetics.filter((cosmetic) => cosmetic.id !== id));
        } catch (error) {
            console.error("Error deleting Toys:", error);
            alert("An error occurred while deleting the Toys. Please try again.");
        }
    };

    const openEditModal = (cosmetic) => {
        setSelectedCosmetic(cosmetic);
        setName(cosmetic.name);
        setDescription(cosmetic.description);
        setQty(cosmetic.qty);
        setPrice(cosmetic.price);
        setFile(null);
        setIsEditModalOpen(true);
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description.trim());
        formData.append("qty", qty);
        formData.append("price", price);
        if (file) formData.append("file", file);

        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `https://demo-deployment2-9.onrender.com/admin/update/toys/${selectedCosmetic.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Toys updated successfully!");
            setCosmetics(
                cosmetics.map((cosmetic) =>
                    cosmetic.id === selectedCosmetic.id ? response.data : cosmetic
                )
            );
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating Toys:", error);
            alert("An error occurred while updating the Toys. Please try again.");
        }
    };

    const openModal = () => {
        setName("");
        setDescription("");
        setQty(0);
        setPrice(0);
        setFile(null);
        setIsModalOpen(true);
    };

    <button onClick={openModal} className="pop-up-btn">Post</button>


    return (
        <div className="upload-cosmetics-container">
            <button onClick={() => setIsModalOpen(true)} className="pop-up-btn">Post</button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Upload Toys</h2>
                        <form onSubmit={handleSubmit} className="upload-cosmetics-form">
                            <div>
                                <label>Product Name:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div>
                                <label>Product Description:</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter product description"
                                />
                            </div>
                            <div>
                                <label>Product Quantity:</label>
                                <input
                                    type="number"
                                    value={qty}
                                    onChange={(e) => setQty(Math.max(0, parseInt(e.target.value)))}
                                    placeholder="Enter quantity"
                                />
                            </div>
                            <div>
                                <label>Product Price:</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value)))}
                                    placeholder="Enter price"
                                />
                            </div>
                            <div>
                                <label>Product Image:</label>
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    accept="image/*"
                                />
                            </div>
                            <button type="submit">Upload Toys</button>
                            <button type="button" onClick={() => setIsModalOpen(false)}>Close</button>
                        </form>
                    </div>
                </div>
            )}
            {isEditModalOpen && selectedCosmetic && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Toys</h2>
                        <form onSubmit={handleEdit} className="upload-cosmetics-form">
                            <div>
                                <label>Product Name:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div>
                                <label>Product Description:</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter product description"
                                />
                            </div>
                            <div>
                                <label>Product Quantity:</label>
                                <input
                                    type="number"
                                    value={qty}
                                    onChange={(e) => setQty(Math.max(0, parseInt(e.target.value)))}
                                    placeholder="Enter quantity"
                                />
                            </div>
                            <div>
                                <label>Product Price:</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value)))}
                                    placeholder="Enter price"
                                />
                            </div>
                            <div>
                                <label>Product Image:</label>
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    accept="image/*"
                                />
                            </div>
                            <button type="submit">Update Toys</button>
                            <button type="button" onClick={() => setIsEditModalOpen(false)}>Close</button>
                        </form>
                    </div>
                </div>
            )}
            <div className="cosmetic-table">
                <h3>Uploaded Toys</h3>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cosmetics.length === 0 ? (
                            <tr>
                                <td colSpan="6">No items available.</td>
                            </tr>
                        ) : (
                            cosmetics.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.qty}</td>
                                    <td>{item.price}</td>
                                    <td>
                                        <img src={item.image} alt={item.name} width={200} height={200} />
                                    </td>
                                    <td>
                                        <button onClick={() => openEditModal(item)} className="action-btn">Edit</button>
                                        <button onClick={() => handleDelete(item.id)} className="action-btn">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default uploadToys;
