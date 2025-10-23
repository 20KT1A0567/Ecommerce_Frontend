import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
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
    Grid,
    Alert,
} from "@mui/material";

const UploadWomen = () => {
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
            const response = await axios.get(
                "https://demo-deployment2-7-bbpl.onrender.com/admin/women",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setCosmetics(response.data);
        } catch (error) {
            console.error("Error fetching Women:", error);
            setErrorMessage("Error fetching Women. Please try again.");
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
            await axios.post(
                "https://demo-deployment2-7-bbpl.onrender.com/admin/upload/women",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Women uploaded successfully!");
            setName("");
            setDescription("");
            setQty(0);
            setPrice(0);
            setFile(null);
            setIsModalOpen(false);
            fetchCosmetics();
        } catch (error) {
            console.error("Error uploading Women:", error);
            alert(error.response?.data || "An error occurred while uploading the Women.");
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`https://demo-deployment2-7-bbpl.onrender.com/admin/delete/women/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Women deleted successfully!");
            setCosmetics(cosmetics.filter((cosmetic) => cosmetic.id !== id));
        } catch (error) {
            console.error("Error deleting Women:", error);
            alert("An error occurred while deleting the Women. Please try again.");
        }
    };

    const openEditModal = (cosmetic) => {
        setSelectedCosmetic(cosmetic);
        setName(cosmetic.name);
        setDescription(cosmetic.description);
        setQty(cosmetic.qty);
        setPrice(cosmetic.price);
        setFile(null); // keep file null initially
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
                `https://demo-deployment2-7-bbpl.onrender.com/admin/update/women/${selectedCosmetic.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Women updated successfully!");
            setCosmetics(
                cosmetics.map((cosmetic) =>
                    cosmetic.id === selectedCosmetic.id ? response.data : cosmetic
                )
            );
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating Women:", error);
            alert("An error occurred while updating the Women. Please try again.");
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

    return (
        <Box sx={{ padding: 2 }}>
            <Button variant="contained" onClick={openModal} sx={{ mb: 2 }}>
                Post
            </Button>

            {/* Upload Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Upload Women</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Product Name"
                                    fullWidth
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Product Description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <TextField
                                    label="Product Quantity"
                                    type="number"
                                    fullWidth
                                    inputProps={{ min: 0 }}
                                    value={qty}
                                    onChange={(e) => setQty(Math.max(0, parseInt(e.target.value)))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <TextField
                                    label="Product Price"
                                    type="number"
                                    fullWidth
                                    inputProps={{ min: 0, step: 0.01 }}
                                    value={price}
                                    onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value)))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="outlined" component="label" fullWidth>
                                    Upload Product Image
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        required
                                    />
                                </Button>
                                {file && (
                                    <Typography variant="body2" mt={1}>
                                        Selected file: {file.name}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                        <DialogActions sx={{ mt: 2 }}>
                            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button variant="contained" type="submit">
                                Upload Women
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Women</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleEdit} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Product Name"
                                    fullWidth
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Product Description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <TextField
                                    label="Product Quantity"
                                    type="number"
                                    fullWidth
                                    inputProps={{ min: 0 }}
                                    value={qty}
                                    onChange={(e) => setQty(Math.max(0, parseInt(e.target.value)))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <TextField
                                    label="Product Price"
                                    type="number"
                                    fullWidth
                                    inputProps={{ min: 0, step: 0.01 }}
                                    value={price}
                                    onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value)))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="outlined" component="label" fullWidth>
                                    Upload New Image (optional)
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </Button>
                                {file && (
                                    <Typography variant="body2" mt={1}>
                                        Selected file: {file.name}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                        <DialogActions sx={{ mt: 2 }}>
                            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button variant="contained" type="submit">
                                Update Women
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Table */}
            <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                    Uploaded Women
                </Typography>
                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}
                <TableContainer component={Paper}>
                    <Table aria-label="uploaded women table" size="small">
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
                            {cosmetics.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No items available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                cosmetics.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.qty}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell>
                                            <Box
                                                component="img"
                                                src={item.image}
                                                alt={item.name}
                                                sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 1 }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ mr: 1 }}
                                                onClick={() => openEditModal(item)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(item.id)}
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
            </Box>
        </Box>
    );
};

export default UploadWomen;
