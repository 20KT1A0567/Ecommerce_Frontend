import React, { useState, useEffect } from "react";
import axios from "axios";

import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Paper,
    CircularProgress,
} from "@mui/material";

const UploadToys = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedToy, setSelectedToy] = useState(null);
    const [toys, setToys] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    const fetchToys = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "https://demo-deployment2-8-cq0p.onrender.com/admin/toys",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setToys(response.data);
            setErrorMessage("");
        } catch (error) {
            console.error("Error fetching Toys:", error);
            setErrorMessage("Error fetching Toys. Please try again.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchToys();
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

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description.trim());
        formData.append("qty", qty);
        formData.append("price", price);
        formData.append("file", file);

        const token = localStorage.getItem("token");

        try {
            setSubmitLoading(true);
            await axios.post(
                "https://demo-deployment2-8-cq0p.onrender.com/admin/upload/toys",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Toys uploaded successfully!");
            resetForm();
            setIsModalOpen(false);
            fetchToys();
        } catch (error) {
            console.error("Error uploading Toys:", error);
            alert(
                error.response?.data || "An error occurred while uploading the Toys."
            );
        }
        setSubmitLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(
                `https://demo-deployment2-8-cq0p.onrender.com/admin/delete/toys/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Toys deleted successfully!");
            setToys(toys.filter((toy) => toy.id !== id));
        } catch (error) {
            console.error("Error deleting Toys:", error);
            alert("An error occurred while deleting the Toys. Please try again.");
        }
    };

    const openEditModal = (toy) => {
        setSelectedToy(toy);
        setName(toy.name);
        setDescription(toy.description);
        setQty(toy.qty);
        setPrice(toy.price);
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
            setEditLoading(true);
            const response = await axios.put(
                `https://demo-deployment2-8-cq0p.onrender.com/admin/update/toys/${selectedToy.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Toys updated successfully!");
            setToys(
                toys.map((toy) =>
                    toy.id === selectedToy.id ? response.data : toy
                )
            );
            setIsEditModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error updating Toys:", error);
            alert("An error occurred while updating the Toys. Please try again.");
        }
        setEditLoading(false);
    };

    const openModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Toys Management
            </Typography>

            <Button variant="contained" onClick={openModal} sx={{ mb: 3 }}>
                Post New Toy
            </Button>

            {/* Upload Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Upload Toys</DialogTitle>
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
                            multiline
                            minRows={3}
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={submitLoading}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    label="Quantity"
                                    type="number"
                                    fullWidth
                                    required
                                    inputProps={{ min: 0 }}
                                    value={qty}
                                    onChange={(e) => setQty(Math.max(0, parseInt(e.target.value) || 0))}
                                    disabled={submitLoading}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    label="Price"
                                    type="number"
                                    fullWidth
                                    required
                                    inputProps={{ min: 0, step: "0.01" }}
                                    value={price}
                                    onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                                    disabled={submitLoading}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            variant="outlined"
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
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Toy</DialogTitle>
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
                            multiline
                            minRows={3}
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={editLoading}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    label="Quantity"
                                    type="number"
                                    fullWidth
                                    required
                                    inputProps={{ min: 0 }}
                                    value={qty}
                                    onChange={(e) => setQty(Math.max(0, parseInt(e.target.value) || 0))}
                                    disabled={editLoading}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    label="Price"
                                    type="number"
                                    fullWidth
                                    required
                                    inputProps={{ min: 0, step: "0.01" }}
                                    value={price}
                                    onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                                    disabled={editLoading}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            variant="outlined"
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

            {/* Toys Table */}
            <Typography variant="h5" gutterBottom>
                Uploaded Toys
            </Typography>

            {errorMessage && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                    <Table stickyHeader aria-label="toys table" size="small">
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
                            {toys.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No items available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                toys.map((toy) => (
                                    <TableRow key={toy.id} hover>
                                        <TableCell>{toy.name}</TableCell>
                                        <TableCell>{toy.description}</TableCell>
                                        <TableCell>{toy.qty}</TableCell>
                                        <TableCell>${toy.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <img
                                                src={toy.image}
                                                alt={toy.name}
                                                style={{ maxWidth: 120, maxHeight: 120, objectFit: "contain" }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{ mr: 1 }}
                                                onClick={() => openEditModal(toy)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDelete(toy.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default UploadToys;
