import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    Grid,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const UploadMobiles = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMobile, setSelectedMobile] = useState(null);
    const [mobiles, setMobiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    const fetchMobiles = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "https://demo-deployment2-15-syk7.onrender.com/admin/mobiles",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMobiles(response.data);
            setErrorMessage("");
        } catch (error) {
            console.error("Error fetching Mobiles:", error);
            setErrorMessage("Error fetching Mobiles. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMobiles();
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
            await axios.post(
                "https://demo-deployment2-15-syk7.onrender.com/admin/upload/mobiles",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Mobiles uploaded successfully!");
            resetForm();
            setIsModalOpen(false);
            fetchMobiles();
        } catch (error) {
            console.error("Error uploading Mobiles:", error);
            alert(error.response?.data || "An error occurred while uploading the Mobiles.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `https://demo-deployment2-15-syk7.onrender.com/admin/delete/mobiles/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Mobiles deleted successfully!");
            setMobiles(mobiles.filter((mobile) => mobile.id !== id));
        } catch (error) {
            console.error("Error deleting Mobiles:", error);
            alert("An error occurred while deleting the Mobiles. Please try again.");
        }
    };

    const openEditModal = (mobile) => {
        setSelectedMobile(mobile);
        setName(mobile.name);
        setDescription(mobile.description);
        setQty(mobile.qty);
        setPrice(mobile.price);
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
                `https://demo-deployment2-15-syk7.onrender.com/admin/update/mobiles/${selectedMobile.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Mobiles updated successfully!");
            setMobiles(
                mobiles.map((mobile) =>
                    mobile.id === selectedMobile.id ? response.data : mobile
                )
            );
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating Mobiles:", error);
            alert("An error occurred while updating the Mobiles. Please try again.");
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
                Upload Mobiles
            </Typography>

            <Button variant="contained" onClick={openModal} sx={{ mb: 3 }}>
                Post New Mobile
            </Button>

            {errorMessage && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                    <Table stickyHeader aria-label="mobiles table" size="medium">
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
                            {mobiles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No items available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                mobiles.map((mobile) => (
                                    <TableRow key={mobile.id} hover>
                                        <TableCell>{mobile.name}</TableCell>
                                        <TableCell sx={{ maxWidth: 300, whiteSpace: "normal", wordBreak: "break-word" }}>
                                            {mobile.description}
                                        </TableCell>
                                        <TableCell>{mobile.qty}</TableCell>
                                        <TableCell>${mobile.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <img
                                                src={mobile.image}
                                                alt={mobile.name}
                                                style={{ maxWidth: 120, maxHeight: 120, objectFit: "contain" }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                aria-label="edit"
                                                onClick={() => openEditModal(mobile)}
                                                size="large"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                aria-label="delete"
                                                onClick={() => handleDelete(mobile.id)}
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
                <DialogTitle>Upload Mobile</DialogTitle>
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
            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Mobile</DialogTitle>
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

export default UploadMobiles;
