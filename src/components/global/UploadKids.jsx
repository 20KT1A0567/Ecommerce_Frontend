import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    Alert,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const UploadKids = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [items, setItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://demo-deployment2-8-cq0p.onrender.com/admin/kids", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setItems(response.data);
            setErrorMessage("");
        } catch (error) {
            console.error("Error fetching Kids:", error);
            setErrorMessage("Error fetching Kids. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const resetForm = () => {
        setName("");
        setDescription("");
        setQty(0);
        setPrice(0);
        setFile(null);
    };

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

        setSubmitLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description.trim());
        formData.append("qty", qty);
        formData.append("price", price);
        formData.append("file", file);

        try {
            const token = localStorage.getItem("token");
            await axios.post("https://demo-deployment2-8-cq0p.onrender.com/admin/upload/kids", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Kids uploaded successfully!");
            resetForm();
            setIsModalOpen(false);
            fetchItems();
        } catch (error) {
            console.error("Error uploading Kids:", error);
            alert(error.response?.data || "An error occurred while uploading the Kids.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://demo-deployment2-8-cq0p.onrender.com/admin/delete/kids/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Kids deleted successfully!");
            setItems(items.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error deleting Kids:", error);
            alert("An error occurred while deleting the Kids. Please try again.");
        }
    };

    const openEditModal = (item) => {
        setSelectedItem(item);
        setName(item.name);
        setDescription(item.description);
        setQty(item.qty);
        setPrice(item.price);
        setFile(null);
        setIsEditModalOpen(true);
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        if (!name || !description || qty <= 0 || price <= 0) {
            alert("All fields are required, and values must be valid!");
            return;
        }
        if (file && !file.type.startsWith("image/")) {
            alert("Only image files are allowed!");
            return;
        }

        setEditLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description.trim());
        formData.append("qty", qty);
        formData.append("price", price);
        if (file) formData.append("file", file);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `https://demo-deployment2-8-cq0p.onrender.com/admin/update/kids/${selectedItem.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Kids updated successfully!");
            setItems(items.map((item) => (item.id === selectedItem.id ? response.data : item)));
            setIsEditModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error updating Kids:", error);
            alert("An error occurred while updating the Kids. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };

    const openModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Upload Kids Products
            </Typography>

            <Button variant="contained" onClick={openModal} sx={{ mb: 3 }}>
                Post New Item
            </Button>

            {errorMessage && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {errorMessage}
                </Alert>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                    <Table stickyHeader aria-label="kids table" size="medium">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No items available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => (
                                    <TableRow key={item.id} hover>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell
                                            sx={{ maxWidth: 250, whiteSpace: "normal", wordBreak: "break-word" }}
                                        >
                                            {item.description}
                                        </TableCell>
                                        <TableCell>{item.qty}</TableCell>
                                        <TableCell>${item.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{ maxWidth: 120, maxHeight: 120, objectFit: "contain" }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                onClick={() => openEditModal(item)}
                                                aria-label="edit"
                                                size="large"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(item.id)}
                                                aria-label="delete"
                                                size="large"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Upload Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Upload Kids Product</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            label="Product Name"
                            fullWidth
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={submitLoading}
                        />
                        <TextField
                            margin="normal"
                            label="Product Description"
                            fullWidth
                            required
                            multiline
                            minRows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={submitLoading}
                        />
                        <TextField
                            margin="normal"
                            label="Product Quantity"
                            type="number"
                            fullWidth
                            required
                            inputProps={{ min: 0 }}
                            value={qty}
                            onChange={(e) => setQty(Math.max(0, parseInt(e.target.value) || 0))}
                            disabled={submitLoading}
                        />
                        <TextField
                            margin="normal"
                            label="Product Price"
                            type="number"
                            fullWidth
                            required
                            inputProps={{ min: 0, step: "0.01" }}
                            value={price}
                            onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                            disabled={submitLoading}
                        />
                        <Button
                            variant="contained"
                            component="label"
                            sx={{ mt: 2 }}
                            disabled={submitLoading}
                            fullWidth
                        >
                            Upload Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                disabled={submitLoading}
                            />
                        </Button>
                        {file && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Selected file: {file.name}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsModalOpen(false)} disabled={submitLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={submitLoading}
                        startIcon={submitLoading && <CircularProgress size={20} />}
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Modal */}
            <Dialog
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit Kids Product</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleEdit} noValidate>
                        <TextField
                            margin="normal"
                            label="Product Name"
                            fullWidth
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={editLoading}
                        />
                        <TextField
                            margin="normal"
                            label="Product Description"
                            fullWidth
                            required
                            multiline
                            minRows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={editLoading}
                        />
                        <TextField
                            margin="normal"
                            label="Product Quantity"
                            type="number"
                            fullWidth
                            required
                            inputProps={{ min: 0 }}
                            value={qty}
                            onChange={(e) => setQty(Math.max(0, parseInt(e.target.value) || 0))}
                            disabled={editLoading}
                        />
                        <TextField
                            margin="normal"
                            label="Product Price"
                            type="number"
                            fullWidth
                            required
                            inputProps={{ min: 0, step: "0.01" }}
                            value={price}
                            onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                            disabled={editLoading}
                        />
                        <Button
                            variant="contained"
                            component="label"
                            sx={{ mt: 2 }}
                            disabled={editLoading}
                            fullWidth
                        >
                            Upload New Image (optional)
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                disabled={editLoading}
                            />
                        </Button>
                        {file && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Selected file: {file.name}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditModalOpen(false)} disabled={editLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEdit}
                        variant="contained"
                        disabled={editLoading}
                        startIcon={editLoading && <CircularProgress size={20} />}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UploadKids;
