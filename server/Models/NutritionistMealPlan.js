const mongoose = require('mongoose');

// Define the schema for a single meal entry
const mealEntrySchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., 'breakfast', 'lunch', 'morningSnack'
    name: { type: String, required: true },
    portions: { type: String },
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fats: { type: Number },
});

// Define the schema for a single day's plan
const dailyPlanSchema = new mongoose.Schema({
    breakfast: [mealEntrySchema],
    lunch: [mealEntrySchema],
    dinner: [mealEntrySchema],
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFats: { type: Number, default: 0 },
    notes: { type: String }
});

// Define the main nutritionist meal plan schema
const nutritionistMealPlanSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Assuming your client model is named 'Customer'
        required: true
    },
    nutritionist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nutritionist', // Assuming your nutritionist model is named 'Nutritionist'
        required: true
    },
    // Reference to the original request, if needed
    mealPlanRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MealPlanRequest', // Assuming your request model is named 'MealPlanRequest'
        required: false // Set to true if every meal plan must be linked to a request
    },
    status: {
        type: String,
        default: 'sent'
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    specialInstructions: { type: String },
    weeklyNotes: { type: String },
    weeklyPlan: {
        monday: dailyPlanSchema,
        tuesday: dailyPlanSchema,
        wednesday: dailyPlanSchema,
        thursday: dailyPlanSchema,
        friday: dailyPlanSchema,
        saturday: dailyPlanSchema,
        sunday: dailyPlanSchema,
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('NutritionistMealPlan', nutritionistMealPlanSchema);