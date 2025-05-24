const express = require("express");
const router = express.Router();
const {
    registerCustomer,
    loginCustomer,
    getProfile,
    updateProfile,
    requestConsultancy,
    updateProgress,
    getProgressHistory,
    submitFeedback,
    getUserMealPlanRequests,
    getNutritionists,
    getNutritionistById,
    getRequestHistory,
    applyForMealPlan,
    verifyMealPlanPayment,
    getPaymentStatus,
    getPaymentByRequestId,
    getMealPlanById,
    getCustomerMealPlan
} = require("../Controller/CustomerController");
const { VerifyCustomerToken } = require("../Middleware/authCustomer");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/customer");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Authentication routes
router.post("/login", loginCustomer);
router.post("/Register", upload.single("profile"), registerCustomer);

// Profile routes
router.get("/profile", VerifyCustomerToken, getProfile);
router.put("/update-profile", VerifyCustomerToken, upload.single("profile"), updateProfile);

// Consultancy routes
router.post("/request-consultancy", VerifyCustomerToken, requestConsultancy);
router.get("/consultancy-history", VerifyCustomerToken, getRequestHistory);  // Fixed typo in route path

// Progress tracking routes
router.post("/update-progress", VerifyCustomerToken, upload.array("photos"), updateProgress);
router.get("/progress-history", VerifyCustomerToken, getProgressHistory);
router.post('/progress/:planId', VerifyCustomerToken, upload.array('photos', 5), updateProgress);
router.get('/progress/:planId', VerifyCustomerToken, getProgressHistory);

// Feedback routes
router.post("/submit-feedback", VerifyCustomerToken, submitFeedback);

// Meal plan routes
router.post("/apply-for-meal-plan/:nutritionistId", VerifyCustomerToken, applyForMealPlan);
router.get("/meal-plan-requests", VerifyCustomerToken, getUserMealPlanRequests);
// Add this new route
router.get("/getNutritionists", VerifyCustomerToken, getNutritionists);

// Add this new route for getting individual nutritionist profile
router.get("/nutritionist/:id", VerifyCustomerToken, getNutritionistById);

// Add payment verification route
router.post("/verify-payment", VerifyCustomerToken, verifyMealPlanPayment);
router.get('/payment-status/:requestId', VerifyCustomerToken, getPaymentStatus);
// Add this new route
router.get('/payments/:requestId', VerifyCustomerToken, getPaymentByRequestId);
// Add this route
router.get('/meal-plan/:requestId', VerifyCustomerToken, getMealPlanById);
// Change this route to match your API call
router.get('/meal-plan-data/:requestId', VerifyCustomerToken, getCustomerMealPlan);

module.exports = router;