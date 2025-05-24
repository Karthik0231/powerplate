const express = require("express");
const router = express.Router();
const {
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
    getGeneratedMealPlanByRequestId,
    getClientProgress,
    getNutritionistFeedbacks,
    getNutritionistPayments
} = require("../Controller/NutController");
const { VerifyNutritionistToken } = require("../middleware/authNutritionist");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/nutritionist");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Authentication routes
router.post("/login", loginNutritionist);  // Make sure this matches the exported function name

// Profile management routes
router.get("/profile", VerifyNutritionistToken, getNutritionistProfile);
router.put("/profile", VerifyNutritionistToken, upload.single("profile"), updateProfile);
router.put("/change-password", VerifyNutritionistToken, changePassword);

// Client management routes
router.get("/clients", VerifyNutritionistToken, getAssignedClients);
router.put("/consultancy-request/:requestId", VerifyNutritionistToken, handleConsultancyRequest);
router.delete("/consultancy-request/:requestId", VerifyNutritionistToken, deleteRequest);

// Meal plan routes
router.post("/meal-plan", VerifyNutritionistToken, createMealPlan);
router.get("/mealplan-requests", VerifyNutritionistToken, getMealPlanRequests);
router.get("/mealplan-requests/:requestId", VerifyNutritionistToken, getSingleMealPlanRequest);
// Submit generated meal plan
router.post("/submit-meal-plan", VerifyNutritionistToken, submitGeneratedMealPlan);

// Add this new route
router.get("/requests", VerifyNutritionistToken, getAllRequests);

// Nutritionist Meal Plan routes
router.get("/nutritionist-meal-plans", VerifyNutritionistToken, getNutritionistMealPlans);
router.get("/nutritionist-meal-plans/:mealPlanId", VerifyNutritionistToken, getSingleNutritionistMealPlan);
router.put("/nutritionist-meal-plans/:mealPlanId", VerifyNutritionistToken, updateNutritionistMealPlan);
router.delete("/nutritionist-meal-plans/:mealPlanId", VerifyNutritionistToken, deleteNutritionistMealPlan);

// Add this new route for getting generated meal plan by request ID
router.get("/generated-meal-plan/:requestId", VerifyNutritionistToken, getGeneratedMealPlanByRequestId);

// Meal Plan status update route
router.put("/meal-plans/:mealPlanId/status", VerifyNutritionistToken, updateMealPlanStatus);

// Add this new route
router.get("/meal-plan-progress/:requestId", VerifyNutritionistToken, getClientProgress);

// Add this with other routes
router.get("/feedbacks", VerifyNutritionistToken, getNutritionistFeedbacks);

// Add this new route for payments
router.get("/payments", VerifyNutritionistToken, getNutritionistPayments);

module.exports = router;