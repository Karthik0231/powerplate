const secretKey = "powerplate";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../Models/Customer");
const ConsultancyRequest = require("../Models/ConsultancyRequest");
const Progress = require("../Models/Progress");
const Feedback = require("../Models/Feedback");
const MealPlan = require("../Models/MealPlan");
const Nutritionist = require("../Models/Nutritionists");
const Payment = require('../Models/Payment');
const NutritionistMealPlan = require("../Models/NutritionistMealPlan"); // Import the new schema

// Register a new customer
const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, gender, weight, height, age } = req.body;
    const profile = req?.file?.filename;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ 
        success: false,
        message: "Customer already exists" 
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new customer with numeric weight and height
    const newCustomer = new Customer({
      name,
      email,
      password: hashedPassword,
      phone,
      profile,
      gender,
      weight: Number(weight),
      height: Number(height),
      age: Number(age)
    });

    await newCustomer.save();

    res.status(201).json({ 
      success: true,
      message: "Customer registered successfully" 
    });

} catch (error) {
    console.error("Error registering customer:", error);
    res.status(500).json({ 
        success: false,
        message: "Internal server error",
        error: error.message 
    });
}
};

// Login customer
const loginCustomer = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // 🧪 Add this

        const { email, password } = req.body;

        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: customer._id }, "powerplate");
        res.status(200).json({ message: "Login successful", token, success: true });
        console.log("Login successful:", customer); // 🧪 Add this
    } catch (error) {
        console.error("Error logging in customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update customer profile
const updateProfile = async (req, res) => {
    try {
        const customerId = req.customer.id;
        const { name, email, phone, gender, weight, height, age } = req.body;
        const profile = req?.file?.filename;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Check if email is being changed and if it's already in use
        if (email && email !== customer.email) {
            const emailExists = await Customer.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use"
                });
            }
        }

        // Update customer with numeric values for weight, height, and age
        const updatedCustomer = await Customer.findByIdAndUpdate(
            customerId,
            {
                name: name || customer.name,
                email: email || customer.email,
                phone: phone || customer.phone,
                gender: gender || customer.gender,
                weight: weight ? Number(weight) : customer.weight,
                height: height ? Number(height) : customer.height,
                age: age ? Number(age) : customer.age,
                ...(profile && { profile }) // Only include profile if a new one was uploaded
            },
            { new: true }
        ).select('-password');

        // Add profile URL to response
        if (updatedCustomer.profile) {
            updatedCustomer.profileUrl = `/uploads/customer/${updatedCustomer.profile}`;
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            customer: updatedCustomer
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message
        });
    }
};

// Request consultancy
const requestConsultancy = async (req, res) => {
    try {
        const customerId = req.customer.id; // Change this line to access the id property
        const { nutritionistId, message, problem } = req.body;

        // Check if there's already a pending request
        const existingRequest = await ConsultancyRequest.findOne({
            client: customerId,
            nutritionist: nutritionistId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: "You already have a pending request with this nutritionist" });
        }

        const newRequest = new ConsultancyRequest({
            client: customerId,
            nutritionist: nutritionistId,
            message,
            status: 'pending',
            problem,
        });

        await newRequest.save();

        res.status(201).json({
            message: "Consultancy request sent successfully",
            request: newRequest,
            success: true
        });
        console.log("Consultancy request sent:", newRequest); // 🧪 Add this
    } catch (error) {
        console.error("Error requesting consultancy:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update progress
const updateProgress = async (req, res) => {
    try {
        const { planId } = req.params;
        const customerId = req.customer.id;

        // Get the meal plan to get nutritionist ID
        const mealPlan = await MealPlan.findById(planId);
        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal plan not found"
            });
        }

        // Process uploaded files with correct path
        const photoURLs = req.files ? req.files.map(file => `/uploads/customer/${file.filename}`) : [];

        // Create progress entry
        const progress = new Progress({
            client: customerId,
            mealPlan: planId,
            nutritionist: mealPlan.nutritionist,
            weight: req.body.weight,
            height: req.body.height,
            measurements: JSON.parse(req.body.measurements),
            notes: req.body.notes,
            photos: photoURLs
        });

        await progress.save();

        res.status(200).json({
            success: true,
            message: "Progress updated successfully",
            progress
        });

    } catch (error) {
        console.error("Error updating progress:", error);
        res.status(500).json({
            success: false,
            message: "Error updating progress",
            error: error.message
        });
    }
};

// Get progress history
const getProgressHistory = async (req, res) => {
    try {
        const { planId } = req.params;
        const customerId = req.customer.id;

        const progress = await Progress.find({
            client: customerId,
            mealPlan: planId
        })
        .sort({ createdAt: -1 })
        .populate('nutritionist', 'name email');

        res.status(200).json({
            success: true,
            progress
        });

    } catch (error) {
        console.error("Error fetching progress:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching progress history",
            error: error.message
        });
    }
};

// Submit feedback
const submitFeedback = async (req, res) => {
    try {
        const customerId = req.customer.id;
        const { nutritionistId, rating, comment } = req.body;

        // Validate if required fields are present
        if (!nutritionistId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Nutritionist and rating are required"
            });
        }

        // Check if customer has already given feedback
        const existingFeedback = await Feedback.findOne({
            client: customerId,
            nutritionist: nutritionistId
        });

        if (existingFeedback) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted feedback for this nutritionist"
            });
        }

        const newFeedback = new Feedback({
            client: customerId,
            nutritionist: nutritionistId,
            rating,
            comment
        });

        await newFeedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            feedback: newFeedback
        });

    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({
            success: false,
            message: "Error submitting feedback",
            error: error.message
        });
    }
};

// Get profile
const getProfile = async (req, res) => {
    try {
        // Extract the ID correctly from req.customer
        const customerId = req.customer.id || req.customer;
        
        // Find customer by ID and exclude password
        const customer = await Customer.findById(customerId)
            .select('-password')
            .lean();

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Add the full URL for profile image if exists
        if (customer.profile) {
            customer.profileUrl = `/uploads/customer/${customer.profile}`;
        }

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            customer
        });

    } catch (error) {
        console.error("Error fetching customer profile:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching profile",
            error: error.message
        });
    }
};

//get request history
const getRequestHistory = async (req, res) => {
    try {
        // Get customer ID from the token - fix the ID extraction
        const customerId = req.customer.id || req.customer;  // Handle both cases

        // Find all requests for this customer and populate nutritionist details
        const requests = await ConsultancyRequest.find({ client: customerId })
            .populate({
                path: 'nutritionist',
                select: 'name email profile specializedDegrees experience'
            })
            .sort({ createdAt: -1 });

        // Log the found requests for debugging
        console.log('Found requests:', requests);

        // Return the requests, even if empty
        res.status(200).json({
            success: true,
            message: requests.length > 0 ? "Requests found successfully" : "No requests found",
            requests: requests
        });

    } catch (error) {
        console.error("Error in getRequestHistory:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching request history",
            error: error.message
        });
    }
};


// Get meal plans


// Get all nutritionists
const getNutritionists = async (req, res) => {
    try {
        const nutritionists = await Nutritionist.find({ status: 'active' })
            .select('-password'); // Exclude password from response

        res.status(200).json({
            nutritionists,
            success: true
        });
    } catch (error) {
        console.error("Error fetching nutritionists:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get nutritionist by ID
const getNutritionistById = async (req, res) => {
    try {
        const nutritionist = await Nutritionist.findById(req.params.id)
            .select('-password'); // Exclude password from response

        if (!nutritionist) {
            return res.status(404).json({ 
                message: "Nutritionist not found",
                success: false 
            });
        }

        res.status(200).json({
            nutritionist,
            success: true
        });
    } catch (error) {
        console.error("Error fetching nutritionist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Apply for meal plan
// Updated backend controller
const applyForMealPlan = async (req, res) => {
    try {
        const customerId = req.customer.id; // This should be populated from your auth middleware
        const { nutritionistId } = req.params; // Get nutritionistId from URL parameters
        
        // Extract all form data directly from request body
        const formData = req.body;
        
        // Create new meal plan application using the schema structure
        const newMealPlanRequest = new MealPlan({
            client: customerId,
            nutritionist: nutritionistId,
            status: 'pending',
            basicInfo: {
                age: formData.age,
                gender: formData.gender,
                height: formData.height,
                currentWeight: formData.currentWeight,
                targetWeight: formData.targetWeight
            },
            healthInfo: {
                activityLevel: formData.activityLevel,
                waterIntake: formData.waterIntake,
                sleepHours: formData.sleepHours,
                medicalConditions: formData.medicalConditions,
                medications: formData.medications
            },
            dietaryInfo: {
                allergies: Array.isArray(formData.allergies) ? formData.allergies : [],
                dietType: formData.dietType,
                cuisinePreferences: Array.isArray(formData.cuisinePreferences) ? formData.cuisinePreferences : [],
                mealFrequency: Number(formData.mealFrequency) || 3
            },
            mealPreferences: {
                breakfast: formData.mealPreferences?.breakfast || false,
                previousDiets: formData.previousDiets
            },
            additionalPreferences: {
                budgetConstraint: formData.budgetConstraint,
                groceryFrequency: formData.groceryFrequency,
                foodRestrictions: formData.foodRestrictions,
                additionalNotes: formData.additionalNotes
            }
        });
        
        await newMealPlanRequest.save();
        
        res.status(201).json({
            success: true,
            message: "Meal plan application submitted successfully",
            mealPlanRequest: newMealPlanRequest
        });
        
    } catch (error) {
        console.error("Error applying for meal plan:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Get user's meal plan requests
const getUserMealPlanRequests = async (req, res) => {
    try {
        const customerId = req.customer.id || req.customer; // Handle both cases
        
        // Find all meal plan requests for this customer and populate nutritionist details
        const mealPlanRequests = await MealPlan.find({ client: customerId })
            .populate({
                path: 'nutritionist',
                select: 'name email profile specializedDegrees experience'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: mealPlanRequests.length > 0 ? "Meal plan requests found" : "No meal plan requests found",
            mealPlanRequests: mealPlanRequests
        });
        console.log('Found meal plan requests:', mealPlanRequests); // 🧪 Add this

    } catch (error) {
        console.error("Error in getUserMealPlanRequests:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching meal plan requests",
            error: error.message
        });
    }
};

// Add this new controller function
const verifyMealPlanPayment = async (req, res) => {
    try {
        const customerId = req.customer.id;
        const { requestId, referenceId } = req.body;

        // Validate request ID
        const mealPlanRequest = await MealPlan.findById(requestId);
        if (!mealPlanRequest) {
            return res.status(404).json({
                success: false,
                message: "Meal plan request not found"
            });
        }

        // Check if payment already exists
        const existingPayment = await Payment.findOne({ 
            mealPlanRequest: requestId,
            status: 'processing'
        });

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: "Payment already initiated for this request"
            });
        }

        // Create new payment record
        const payment = new Payment({
            client: customerId,
            mealPlanRequest: requestId,
            referenceId,
            status: 'processing' // Set initial status as processing
        });

        await payment.save();

        res.status(200).json({
            success: true,
            message: "Payment initiated successfully",
            payment: {
                id: payment._id,
                amount: payment.amount,
                referenceId: payment.referenceId,
                status: payment.status,
                date: payment.paymentDate
            }
        });

    } catch (error) {
        console.error("Error initiating payment:", error);
        res.status(500).json({
            success: false,
            message: "Error initiating payment",
            error: error.message
        });
    }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const payment = await Payment.findOne({ 
            mealPlanRequest: requestId 
        }).sort({ createdAt: -1 }); // Get the latest payment

        res.json({
            success: true,
            payment
        });
    } catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment status'
        });
    }
};

// Get payment by request ID
const getPaymentByRequestId = async (req, res) => {
    try {
        const { requestId } = req.params;
        const payment = await Payment.findOne({ 
            mealPlanRequest: requestId 
        }).sort({ createdAt: -1 }); // Get the latest payment for this request

        res.json({
            success: true,
            payment
        });
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment details'
        });
    }
};

// Get meal plan by ID
const getMealPlanById = async (req, res) => {
    try {
        const { requestId } = req.params;
        const customerId = req.customer.id;

        // First check if the user has paid for this meal plan
        const payment = await Payment.findOne({ 
            mealPlanRequest: requestId,
            client: customerId,
            status: 'paid'
        });

        if (!payment) {
            return res.status(403).json({
                success: false,
                message: "Payment required to view this meal plan"
            });
        }

        // Find the generated meal plan
        const generatedMealPlan = await NutritionistMealPlan.findOne({
            mealPlanRequest: requestId
        }).populate('nutritionist', 'name email');

        if (!generatedMealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal plan not found"
            });
        }

        res.status(200).json({
            success: true,
            mealPlan: generatedMealPlan
        });

    } catch (error) {
        console.error('Error fetching meal plan:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching meal plan details'
        });
    }
};

// Get customer's meal plan
const getCustomerMealPlan = async (req, res) => {
    try {
        const { requestId } = req.params;
        const customerId = req.customer.id;

        // First verify payment status
        const payment = await Payment.findOne({ 
            mealPlanRequest: requestId,
            client: customerId,
            status: 'paid'  // Only proceed if payment is confirmed
        });

        if (!payment) {
            return res.status(403).json({
                success: false,
                message: "Payment verification required to view meal plan"
            });
        }

        // Get the generated meal plan
        const mealPlan = await NutritionistMealPlan.findOne({
            mealPlanRequest: requestId
        }).populate('nutritionist', 'name email specializedDegrees');

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal plan not found"
            });
        }

        // Check if this meal plan belongs to the requesting user
        const originalRequest = await MealPlan.findOne({
            _id: requestId,
            client: customerId
        });

        if (!originalRequest) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to view this meal plan"
            });
        }

        res.status(200).json({
            success: true,
            mealPlan: {
                ...mealPlan._doc,
                paymentStatus: payment.status,
                paymentDate: payment.paymentDate
            }
        });

    } catch (error) {
        console.error("Error fetching meal plan:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving meal plan",
            error: error.message
        });
    }
};

module.exports = {
    registerCustomer,
    loginCustomer,
    getProfile,
    updateProfile,
    requestConsultancy,
    updateProgress,
    getProgressHistory,
    submitFeedback,
    getNutritionistById,  // Add this to exports
    getNutritionists,
    getRequestHistory,
    applyForMealPlan,
    getUserMealPlanRequests,
    verifyMealPlanPayment,
    getPaymentStatus,
    getPaymentByRequestId, // Add this to exports
    getMealPlanById,
    getCustomerMealPlan, // Add this new export
};