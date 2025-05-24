const mongoose = require('mongoose');

// Define the schema for a single meal entry
const mealEntrySchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., 'breakfast', 'lunch'
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
    morningSnack: [mealEntrySchema],
    lunch: [mealEntrySchema],
    afternoonSnack: [mealEntrySchema],
    dinner: [mealEntrySchema],
    eveningSnack: [mealEntrySchema],
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFats: { type: Number, default: 0 },
    notes: { type: String }
});

// Define the main meal plan schema
const mealPlanSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    nutritionist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nutritionist',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    basicInfo: {
        age: Number,
        gender: String,
        height: Number,
        currentWeight: Number,
        targetWeight: Number
    },
    healthInfo: {
        activityLevel: String,
        waterIntake: Number,
        sleepHours: Number,
        medicalConditions: String,
        medications: String
    },
    dietaryInfo: {
        allergies: [String],
        dietType: String,
        cuisinePreferences: [String],
        mealFrequency: Number
    },
    mealPreferences: {
        breakfast: Boolean,
        morningSnack: Boolean,
        lunch: Boolean,
        afternoonSnack: Boolean,
        dinner: Boolean,
        eveningSnack: Boolean,
        mealPrepTime: String,
        cookingSkill: String
    },
    goalInfo: {
        goalType: String,
        targetTimeframe: String,
        priorityLevel: String,
        previousDiets: String
    },
    additionalPreferences: {
        budgetConstraint: String,
        groceryFrequency: String,
        foodRestrictions: String,
        additionalNotes: String
    },
    weeklyPlan: {
        monday: dailyPlanSchema,
        tuesday: dailyPlanSchema,
        wednesday: dailyPlanSchema,
        thursday: dailyPlanSchema,
        friday: dailyPlanSchema,
        saturday: dailyPlanSchema,
        sunday: dailyPlanSchema,
        startDate: { type: Date },
        endDate: { type: Date },
        specialInstructions: { type: String },
        weeklyNotes: { type: String }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);