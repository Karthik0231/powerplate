const secretKey = "powerplate";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminSchema=require("../Models/Admin");
const NutritionistSchema=require("../Models/Nutritionists");
const PaymentSchema=require("../Models/Payment");
const CustomerSchema = require("../Models/Customer");
const FeedbackSchema = require("../Models/Feedback");

const registerAdmin = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await AdminSchema.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new admin
        const newAdmin = new AdminSchema({
            name,
            email,
            password: hashedPassword,
        }).save();

        res.status(201).json({ message: "Admin registered successfully" });
    }
    catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    }

    const loginAdmin = async (req, res) => {
        try{
            const {email,password}=req.body;    
            const admin=await AdminSchema.findOne({email});
            if(!admin){
                return res.status(400).json({message:"Invalid credentials"});
            }
            const isPasswordValid=await bcrypt.compare(password,admin.password);
            if(!isPasswordValid){
                return res.status(400).json({message:"Invalid Password"});
            }
            const token=jwt.sign(admin.id,secretKey);
            res.status(200).json({message:"Login successful",token,success:true});
            console.log("Login successful:", admin); // 🧪 Add this
        }
        catch (error) {
            console.error("Error logging in admin:", error);
            res.status(500).json({ message: "Internal server error" }); 
            }
        }

        const getAdminProfile = async (req, res) => {
            try{
                const adminId = req.admin;
                const admin = await AdminSchema.findById(adminId);
                if (!admin) {
                    return res.status(404).json({ message: "Admin not found" });
                }
                res.status(200).json({ admin });
            }
            catch (error) {
                console.error("Error fetching admin profile:", error);
                res.status(500).json({ message: "Internal server error" });
            }
            }

    const AddNutritionist = async (req, res) => {
        try {
            const {
                name, email, phone, password, gender, dateOfBirth, address, city, state, zipCode, country,
                qualification, specializedDegrees, certifications, experience, specialization, dietTypesHandled,
                healthConditionsHandled, languages, officeHours, website, linkedIn, instagram,
                bio, status
            } = req.body;
            const profileImage = req?.file?.filename;

            const existingNutritionist = await NutritionistSchema.findOne({ email });
            if (existingNutritionist) {
                return res.status(400).json({ message: "Nutritionist already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newNutritionist = new NutritionistSchema({
                name,
                email,
                phone,
                password: hashedPassword,
                gender,
                dateOfBirth,
                address,
                city,
                state,
                zipCode,
                country,
                qualification,
                specializedDegrees,
                certifications,
                experience,
                specialization,
                dietTypesHandled,
                healthConditionsHandled,
                languages,
                officeHours,
                website,
                linkedIn,
                instagram,
                bio,
                profileImage,
                status
            });

            await newNutritionist.save();
            res.status(201).json({ message: "Nutritionist added successfully", success: true });
            console.log("Nutritionist added successfully:", newNutritionist);
        } catch (error) {
            console.error("Error adding nutritionist:", error);
            res.status(500).json({ message: "Internal server error" });
        }
        }

        const viewNutritionists = async (req, res) => {
            try {
                const nutritionists = await NutritionistSchema.find();
                res.status(200).json({ nutritionists, success: true,message:"success" });  // Add success flag
            } catch (error) {
                console.error("Error fetching nutritionists:", error);
                res.status(500).json({ message: "Internal server error", success: false });
            }
        }

            const updateAdminProfile = async (req, res) => {
                try {
                    const adminId = req.admin;
                    const { name, email } = req.body;
                    const profile = req?.file?.filename;

                    const admin = await AdminSchema.findById(adminId);
                    if (!admin) {
                        return res.status(404).json({ message: "Admin not found" });
                    }

                    // Check if email is being changed and if it's already in use
                    if (email && email !== admin.email) {
                        const emailExists = await AdminSchema.findOne({ email });
                        if (emailExists) {
                            return res.status(400).json({ message: "Email already in use" });
                        }
                    }

                    const updatedAdmin = await AdminSchema.findByIdAndUpdate(
                        adminId,
                        {
                            name: name || admin.name,
                            email: email || admin.email,
                            profile: profile || admin.profile
                        },
                        { new: true }
                    );

                    res.status(200).json({ 
                        message: "Profile updated successfully", 
                        admin: updatedAdmin,
                        success: true 
                    });
                } catch (error) {
                    console.error("Error updating admin profile:", error);
                    res.status(500).json({ message: "Internal server error" });
                }
            };

            const changeAdminPassword = async (req, res) => {
                try {
                    const adminId = req.admin;
                    const { currentPassword, newPassword } = req.body;

                    const admin = await AdminSchema.findById(adminId);
                    if (!admin) {
                        return res.status(404).json({ message: "Admin not found" });
                    }

                    // Verify current password
                    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
                    if (!isPasswordValid) {
                        return res.status(400).json({ message: "Current password is incorrect" });
                    }

                    // Hash and update new password
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    admin.password = hashedPassword;
                    await admin.save();

                    res.status(200).json({ 
                        message: "Password changed successfully",
                        success: true 
                    });
                } catch (error) {
                    console.error("Error changing admin password:", error);
                    res.status(500).json({ message: "Internal server error" });
                }
            };

            const deleteNutritionist = async (req, res) => {
                try {
                    const { nutritionistId } = req.params;

                    const nutritionist = await NutritionistSchema.findById(nutritionistId);
                    if (!nutritionist) {
                        return res.status(404).json({ message: "Nutritionist not found" });
                    }

                    await NutritionistSchema.findByIdAndDelete(nutritionistId);

                    res.status(200).json({ 
                        message: "Nutritionist deleted successfully",
                        success: true 
                    });
                } catch (error) {
                    console.error("Error deleting nutritionist:", error);
                    res.status(500).json({ message: "Internal server error" });
                }
            };

            const updateNutritionistStatus = async (req, res) => {
                try {
                    const { nutritionistId } = req.params;
                    const { status } = req.body;

                    if (!['active', 'blocked'].includes(status)) {
                        return res.status(400).json({ message: "Invalid status value" });
                    }

                    const nutritionist = await NutritionistSchema.findByIdAndUpdate(
                        nutritionistId,
                        { status },
                        { new: true }
                    );

                    if (!nutritionist) {
                        return res.status(404).json({ message: "Nutritionist not found" });
                    }

                    res.status(200).json({ 
                        message: `Nutritionist status updated to ${status}`,
                        nutritionist,
                        success: true 
                    });
                } catch (error) {
                    console.error("Error updating nutritionist status:", error);
                    res.status(500).json({ message: "Internal server error" });
                }
            };

            const viewPayments = async (req, res) => {
                try{
                    const payments = await PaymentSchema.find().populate("client").populate("mealPlanRequest");
                    res.status(200).json({ payments, success: true });
                    } catch (error) {
                    console.error("Error fetching payments:", error);
                    res.status(500).json({ message: "Internal server error", success: false });
                    }   
                }

                const updatePaymentStatus = async (req, res) => {
                    try {
                        const { paymentId } = req.params;
                        const { status } = req.body;
        
                        const payment = await PaymentSchema.findByIdAndUpdate(
                            paymentId,
                            { 
                                status,
                                updatedAt: new Date()
                            },
                            { new: true }
                        );
        
                        if (!payment) {
                            return res.status(404).json({
                                success: false,
                                message: "Payment not found"
                            });
                        }
        
                        res.status(200).json({
                            success: true,
                            message: "Payment status updated successfully",
                            payment
                        });
        
                    } catch (error) {
                        console.error("Error updating payment status:", error);
                        res.status(500).json({
                            success: false,
                            message: "Error updating payment status",
                            error: error.message
                        });
                    }
                };

                const viewUsers = async (req, res) => {
                    try {
                        const users = await CustomerSchema.find().select('-password');
                        res.status(200).json({ 
                            users, 
                            success: true,
                            message: "Users fetched successfully" 
                        });
                    } catch (error) {
                        console.error("Error fetching users:", error);
                        res.status(500).json({ 
                            message: "Internal server error", 
                            success: false 
                        });
                    }
                };

                const deleteUser = async (req, res) => {
                    try {
                        const { userId } = req.params;

                        const user = await CustomerSchema.findById(userId);
                        if (!user) {
                            return res.status(404).json({ 
                                message: "User not found",
                                success: false 
                            });
                        }

                        await CustomerSchema.findByIdAndDelete(userId);

                        res.status(200).json({ 
                            message: "User deleted successfully",
                            success: true 
                        });
                    } catch (error) {
                        console.error("Error deleting user:", error);
                        res.status(500).json({ 
                            message: "Internal server error",
                            success: false 
                        });
                    }
                };

                const viewFeedbacks = async (req, res) => {
                    try {
                        const feedbacks = await FeedbackSchema.find()
                            .populate("client", "-password")
                            .populate("nutritionist", "-password");
        
                        res.status(200).json({ 
                            feedbacks, 
                            success: true,
                            message: "Feedbacks fetched successfully" 
                        });
                    } catch (error) {
                        console.error("Error fetching feedbacks:", error);
                        res.status(500).json({ 
                            message: "Internal server error", 
                            success: false 
                        });
                    }
                };

                const deleteFeedback = async (req, res) => {
                    try {
                        const { feedbackId } = req.params;

                        const feedback = await FeedbackSchema.findById(feedbackId);
                        if (!feedback) {
                            return res.status(404).json({ 
                                message: "Feedback not found",
                                success: false 
                            });
                        }

                        await FeedbackSchema.findByIdAndDelete(feedbackId);

                        res.status(200).json({ 
                            message: "Feedback deleted successfully",
                            success: true 
                        });
                    } catch (error) {
                        console.error("Error deleting feedback:", error);
                        res.status(500).json({ 
                            message: "Internal server error",
                            success: false 
                        });
                    }
                };

            module.exports = { registerAdmin, loginAdmin, getAdminProfile, AddNutritionist, viewNutritionists, updateAdminProfile, changeAdminPassword, deleteNutritionist, updateNutritionistStatus, viewPayments, updatePaymentStatus, viewUsers, deleteUser, viewFeedbacks, deleteFeedback };

