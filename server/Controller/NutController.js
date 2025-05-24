const secretKey = "powerplate";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NutritionistSchema = require("../Models/Nutritionists");
const ConsultancyRequest = require("../Models/ConsultancyRequest");
const MealPlan = require("../Models/MealPlan");
const NutritionistMealPlan = require("../Models/NutritionistMealPlan"); // Import the new schema
const Progress = require("../Models/Progress"); // Import the Feedback model
const Feedback = require("../Models/Feedback"); // Import the Feedback model
const Payment = require("../Models/Payment"); // Import the Payment model

const loginNutritionist = async (req, res) => {
    try {   
        const { email, password } = req.body;
        const nutritionist = await NutritionistSchema.findOne({ email });
        if (!nutritionist) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, nutritionist.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        const checkstatus=nutritionist.status;
        if (checkstatus !== 'active') {
            return res.status(403).json({ message: "Your account is not blocked. Please contact support." });
        }
        const token = jwt.sign({ id: nutritionist._id }, secretKey);
        res.status(200).json({ message: "Login successful", token, success: true });
        console.log("Login successful:", nutritionist);
    } catch (error) {
        console.error("Error logging in nutritionist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update nutritionist profile
const updateProfile = async (req, res) => {
    try {
        const nutritionistId = req.nutritionist;
        const updates = req.body;
        
        // Remove sensitive fields that shouldn't be updated directly
        delete updates.password;
        delete updates.email;
        
        const nutritionist = await NutritionistSchema.findByIdAndUpdate(
            nutritionistId,
            { ...updates, updatedAt: Date.now() },
            { new: true }
        );

        if (!nutritionist) {
            return res.status(404).json({ message: "Nutritionist not found" });
        }

        res.status(200).json({ 
            message: "Profile updated successfully", 
            nutritionist,
            success: true 
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const nutritionistId = req.nutritionist;
        const { currentPassword, newPassword } = req.body;

        const nutritionist = await NutritionistSchema.findById(nutritionistId);
        if (!nutritionist) {
            return res.status(404).json({ message: "Nutritionist not found" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, nutritionist.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        nutritionist.password = hashedPassword;
        await nutritionist.save();

        res.status(200).json({ 
            message: "Password changed successfully",
            success: true 
        });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get assigned clients
const getAssignedClients = async (req, res) => {
    try {
        const nutritionistId = req.nutritionist;
        const consultancyRequests = await ConsultancyRequest.find({
            nutritionist: nutritionistId,
            status: 'accepted'
        }).populate('client', 'name email phone profile');

        res.status(200).json({ 
            clients: consultancyRequests.map(request => request.client),
            success: true 
        });
    } catch (error) {
        console.error("Error fetching assigned clients:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Handle consultancy requests
const handleConsultancyRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, responseMessage } = req.body;
        
        // Get the nutritionist ID from the token
        const nutritionistId = req.nutritionist.id;

        const request = await ConsultancyRequest.findOneAndUpdate(
            {
                _id: requestId,
                nutritionist: nutritionistId // Use the ID directly, not the whole object
            },
            {
                status,
                responseMessage,
                updatedAt: Date.now()
            },
            { new: true }
        ).populate('client', 'name email phone');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found or you're not authorized to update it"
            });
        }

        res.status(200).json({
            success: true,
            message: `Request ${status} successfully`,
            request
        });
    } catch (error) {
        console.error("Error handling consultancy request:", error);
        res.status(500).json({
            success: false,
            message: "Error updating request status",
            error: error.message
        });
    }
};

const deleteRequest = async (req, res) => {
    try{
        const { requestId } = req.params;
        const nutritionistId = req.nutritionist.id;

        const request = await ConsultancyRequest.findOneAndDelete({
            _id: requestId,
            nutritionist: nutritionistId
        });

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        res.status(200).json({ success: true, message: "Request deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting request:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Create meal plan
const createMealPlan = async (req, res) => {
    try {
        const nutritionistId = req.nutritionist;
        const { clientId, startDate, endDate, meals, specialInstructions } = req.body;

        const mealPlan = new MealPlan({
            client: clientId,
            nutritionist: nutritionistId,
            startDate,
            endDate,
            meals,
            specialInstructions
        });

        await mealPlan.save();

        res.status(201).json({
            message: "Meal plan created successfully",
            mealPlan,
            success: true
        });
    } catch (error) {
        console.error("Error creating meal plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get nutritionist profile
const getNutritionistProfile = async (req, res) => {
    try {
        const nutritionistId = req.nutritionist;
        const nutritionist = await NutritionistSchema.findById(nutritionistId);
        if (!nutritionist) {
            return res.status(404).json({ message: "Nutritionist not found" });
        }
        res.status(200).json({
            nutritionist,
            success: true
        });
    } catch (error) {
        console.error("Error fetching nutritionist profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all consultancy requests for the nutritionist
const getAllRequests = async (req, res) => {
    try {
        // Fix: Extract just the ID from the nutritionist object
        const nutritionistId = req.nutritionist.id || req.nutritionist;
        
        const requests = await ConsultancyRequest.find({ nutritionist: nutritionistId })
            .populate('client', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            requests,
            success: true 
        });
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
};

const getMealPlanRequests = async (req, res) => {
    try {
        const nutritionistId = req.nutritionist.id; // Get nutritionist ID from auth token
        
        // Find all meal plan requests for this nutritionist
        const requests = await MealPlan.find({ nutritionist: nutritionistId })
            .populate('client', 'name email phone') // Populate user details
            .sort({ createdAt: -1 }); // Sort by latest first
        
        res.status(200).json({
            success: true,
            requests: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching meal plan requests",
            error: error.message
        });
    }
};

// Add new endpoint for single meal plan request
const getSingleMealPlanRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const nutritionistId = req.nutritionist.id;

        const request = await MealPlan.findOne({
            _id: requestId,
            nutritionist: nutritionistId
        }).populate('client', 'name email phone');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Meal plan request not found"
            });
        }

        res.status(200).json({
            success: true,
            requests: [request] // Keeping the same structure as getMealPlanRequests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching meal plan request",
            error: error.message
        });
    }
};

// New endpoint to submit the generated meal plan
const submitGeneratedMealPlan = async (req, res) => {
    try {
        const nutritionistId = req.nutritionist.id; // Get nutritionist ID from auth token
        const {
            client, // This should be the client ID
            mealPlanRequest, // This should be the original request ID
            startDate,
            endDate,
            specialInstructions,
            weeklyNotes,
            weeklyPlan // This should contain the daily plans (monday, tuesday, etc.)
        } = req.body;

        // Basic validation
        if (!client || !nutritionistId || !startDate || !endDate || !weeklyPlan) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: client, nutritionist, startDate, endDate, or weeklyPlan"
            });
        }

        // Create a new NutritionistMealPlan document
        const newMealPlan = new NutritionistMealPlan({
            client: client,
            nutritionist: nutritionistId,
            mealPlanRequest: mealPlanRequest, // Link to the original request if provided
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            specialInstructions: specialInstructions,
            weeklyNotes: weeklyNotes,
            weeklyPlan: weeklyPlan // Assign the structured weekly plan
        });

        await newMealPlan.save();
        // Update the original meal plan request to mark it as submitted
        await MealPlan.findOneAndUpdate(
            { _id: mealPlanRequest },
            { status: 'created' }
        );
        
        res.status(201).json({
            success: true,
            message: "Meal plan saved successfully",
            mealPlan: newMealPlan
        });

    } catch (error) {
        console.error("Error submitting generated meal plan:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save meal plan",
            error: error.message
        });
    }
};

// Get all nutritionist meal plans
const getNutritionistMealPlans = async (req, res) => {
    try {
        const nutritionistId = req.nutritionist.id;
        const mealPlans = await NutritionistMealPlan.find({ nutritionist: nutritionistId })
            .populate('client', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            mealPlans
        });
    } catch (error) {
        console.error("Error fetching meal plans:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching meal plans",
            error: error.message
        });
    }
};

// Get single nutritionist meal plan
const getSingleNutritionistMealPlan = async (req, res) => {
    try {
        const { mealPlanId } = req.params;
        const nutritionistId = req.nutritionist.id;

        const mealPlan = await NutritionistMealPlan.findOne({
            mealPlanRequest: mealPlanId,  // Changed from _id to mealPlanRequest
            nutritionist: nutritionistId
        }).populate('client', 'name email phone');

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal plan not found"
            });
        }

        res.status(200).json({
            success: true,
            mealPlan
        });
    } catch (error) {
        console.error("Error fetching meal plan:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching meal plan",
            error: error.message
        });
    }
};

// Update nutritionist meal plan
const updateNutritionistMealPlan = async (req, res) => {
    try {
        const { mealPlanId } = req.params;
        const nutritionistId = req.nutritionist.id;
        const updates = req.body;

        const mealPlan = await NutritionistMealPlan.findOneAndUpdate(
            {
                _id: mealPlanId,
                nutritionist: nutritionistId
            },
            updates,
            { new: true }
        ).populate('client', 'name email phone');

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal plan not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meal plan updated successfully",
            mealPlan
        });
    } catch (error) {
        console.error("Error updating meal plan:", error);
        res.status(500).json({
            success: false,
            message: "Error updating meal plan",
            error: error.message
        });
    }
};

// Delete nutritionist meal plan
const deleteNutritionistMealPlan = async (req, res) => {
    try {
        const { mealPlanId } = req.params;
        const nutritionistId = req.nutritionist.id;

        // First, find the meal plan to get the request ID before deletion
        const mealPlan = await NutritionistMealPlan.findOne({
            _id: mealPlanId,
            nutritionist: nutritionistId
        });

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal plan not found"
            });
        }

        // Store the request ID
        const requestId = mealPlan.mealPlanRequest;

        // Delete the meal plan
        await NutritionistMealPlan.findByIdAndDelete(mealPlanId);

        // Update the associated request status to pending
        const updatedRequest = await MealPlan.findByIdAndUpdate(
            requestId,
            { 
                status: 'pending',
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedRequest) {
            // Even if request is not found, we've still deleted the meal plan
            console.warn(`Associated request ${requestId} not found after deleting meal plan ${mealPlanId}`);
            return res.status(200).json({
                success: true,
                message: "Meal plan deleted successfully but request not found",
                warning: "Associated request not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meal plan deleted successfully and request reset to pending",
            requestId: requestId,
            requestStatus: 'pending'
        });

    } catch (error) {
        console.error("Error deleting meal plan:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting meal plan",
            error: error.message
        });
    }
};

// Update meal plan status
const updateMealPlanStatus = async (req, res) => {
    try {
        const { mealPlanId } = req.params;
        const { status } = req.body;
        const nutritionistId = req.nutritionist.id;

        if (!['pending', 'approved', 'rejected', 'created'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        // First find the meal plan
        const mealPlan = await MealPlan.findOne({
            _id: mealPlanId,
            nutritionist: nutritionistId
        }).populate('client', 'name email phone');

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal plan not found"
            });
        }

        // Find the generated meal plan associated with this request
        const generatedMealPlan = await NutritionistMealPlan.findOne({
            mealPlanRequest: mealPlanId
        }).populate('client', 'name email phone');

        // Update the status
        mealPlan.status = status;
        await mealPlan.save();

        res.status(200).json({
            success: true,
            message: `Meal plan status updated to ${status}`,
            mealPlan,
            generatedMealPlan // Include the generated meal plan in the response
        });
    } catch (error) {
        console.error("Error updating meal plan status:", error);
        res.status(500).json({
            success: false,
            message: "Error updating meal plan status",
            error: error.message
        });
    }
};

// Get generated meal plan by request ID
const getGeneratedMealPlanByRequestId = async (req, res) => {
    try {
        const { requestId } = req.params;
        const nutritionistId = req.nutritionist.id;

        // Find the meal plan associated with the request ID
        const mealPlan = await NutritionistMealPlan.findOne({
            mealPlanRequest: requestId,
            nutritionist: nutritionistId
        }).populate('client', 'name email phone');

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal plan not found for this request"
            });
        }

        res.status(200).json({
            success: true,
            mealPlan
        });
    } catch (error) {
        console.error("Error fetching generated meal plan:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching generated meal plan",
            error: error.message
        });
    }
};

// New endpoint to get client progress
const getClientProgress = async (req, res) => {
    try {
        const { requestId } = req.params;
        const nutritionistId = req.nutritionist.id;

        // First verify if this meal plan request exists and belongs to the nutritionist
        const mealPlanRequest = await NutritionistMealPlan.findOne({
            mealPlanRequest: requestId,
            nutritionist: nutritionistId,
        }).populate('client');

        if (!mealPlanRequest) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this meal plan's progress"
            });
        }

        // Get progress history specific to this meal plan request
        const progress = await Progress.find({ 
            client: mealPlanRequest.client._id,
            mealPlan: mealPlanRequest.mealPlanRequest, // Changed this line to use mealPlanRequest field
            nutritionist: nutritionistId
        })
        .sort({ date: -1 })
        .populate('mealPlan'); // Optionally populate meal plan details

        // Add some logging to debug
        console.log('Query Parameters:', {
            clientId: mealPlanRequest.client._id,
            mealPlanId: mealPlanRequest.mealPlanRequest,
            nutritionistId: nutritionistId
        });

        res.status(200).json({
            success: true,
            progress,
            clientDetails: mealPlanRequest.client,
            mealPlanDetails: {
                startDate: mealPlanRequest.startDate,
                endDate: mealPlanRequest.endDate,
                status: mealPlanRequest.status,
                duration: mealPlanRequest.duration,
                mealPlanId: mealPlanRequest.mealPlanRequest // Added for debugging
            }
        });

    } catch (error) {
        console.error("Error fetching client progress:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching progress history",
            error: error.message
        });
    }
};

// New endpoint to get nutritionist feedbacks
const getNutritionistFeedbacks = async (req, res) => {
    try {
        const nutritionistId = req.nutritionist.id;

        // Find all feedbacks for this nutritionist
        const feedbacks = await Feedback.find({ nutritionist: nutritionistId })
            .populate('client', 'name email profile')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            feedbacks
        });

    } catch (error) {
        console.error("Error fetching nutritionist feedbacks:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching feedbacks",
            error: error.message
        });
    }
};

// New endpoint to get nutritionist payments
const getNutritionistPayments = async (req, res) => {
    try {
        const nutritionistId = req.nutritionist.id;

        // Find payments where the mealPlanRequest's nutritionist matches
        const payments = await Payment.find()
            .populate('client', 'name email profile phone')
            .populate({
                path: 'mealPlanRequest',
                match: { nutritionist: nutritionistId }, // Filter by nutritionist
                select: 'startDate endDate status duration'
            })
            .sort({ paymentDate: -1 });

        // Filter out payments where mealPlanRequest is null (not for this nutritionist)
        const validPayments = payments.filter(payment => payment.mealPlanRequest);

        // Add debug logging
        console.log('Debug Info:', {
            nutritionistId,
            totalPayments: payments.length,
            validPayments: validPayments.length
        });

        res.status(200).json({
            success: true,
            payments: validPayments
        });

    } catch (error) {
        console.error("Error fetching nutritionist payments:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching payments",
            error: error.message
        });
    }
};

module.exports = {
    loginNutritionist,
    getNutritionistProfile,
    updateProfile,
    changePassword,
    getAssignedClients,
    handleConsultancyRequest,
    createMealPlan,
    deleteRequest,
    getMealPlanRequests,
    getAllRequests,
    getSingleMealPlanRequest,
    submitGeneratedMealPlan,
    getNutritionistMealPlans,
    getSingleNutritionistMealPlan,
    updateNutritionistMealPlan,
    deleteNutritionistMealPlan,
    updateMealPlanStatus,
    getGeneratedMealPlanByRequestId, // Add the new function to exports
    getClientProgress, // Add the new function to exports
    getNutritionistFeedbacks, // Add the new function to exports
    getNutritionistPayments // Add the new function to exports
};
