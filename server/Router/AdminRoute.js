const express = require("express");
const router = express.Router();
const {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    AddNutritionist,
    viewNutritionists,
    updateAdminProfile,
    changeAdminPassword,
    deleteNutritionist,
    updateNutritionistStatus,
    viewPayments,
    updatePaymentStatus,
    viewUsers,
    deleteUser,
    viewFeedbacks,
    deleteFeedback
} = require("../Controller/AdminController");
const multer = require("multer");
const { VerifyAdminToken } = require("../middleware/authAdmin");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/admin");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/login", loginAdmin);
router.post("/Register", registerAdmin);
router.get("/viewAdmin", VerifyAdminToken, getAdminProfile);

// Add a new nutritionist
router.post(
    "/addNutritionist",
    VerifyAdminToken,
    upload.single("profileImage"),
    AddNutritionist
);
router.get("/nutritionists", VerifyAdminToken, viewNutritionists);

// New routes for admin profile management
router.put(
    "/update-profile",
    VerifyAdminToken,
    upload.single("profile"),
    updateAdminProfile
);
router.put("/change-password", VerifyAdminToken, changeAdminPassword);

// New routes for nutritionist management
router.delete("/nutritionist/:nutritionistId", VerifyAdminToken, deleteNutritionist);
router.put("/nutritionist/:nutritionistId/status", VerifyAdminToken, updateNutritionistStatus);

// New route for viewing payments
router.get("/payments", VerifyAdminToken, viewPayments);
router.put("/payments/:paymentId/status", VerifyAdminToken, updatePaymentStatus);

// Add these routes with your existing routes
router.get("/users", VerifyAdminToken, viewUsers);
router.delete("/user/:userId", VerifyAdminToken, deleteUser);
router.get("/feedbacks", VerifyAdminToken, viewFeedbacks);
router.delete("/feedback/:feedbackId", VerifyAdminToken, deleteFeedback);

module.exports = router;
