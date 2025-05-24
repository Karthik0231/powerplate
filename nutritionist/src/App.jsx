// App.jsx
import React, { createContext, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Dashboard, Navbar, SideBar } from "./scenes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Context from "./Context/Context";
// import Nutritionists from "./Pages/Nutritionists";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Form from "./scenes/form";
import Calendar from "./scenes/calendar";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Stream from "./scenes/stream";
import ManageRequests from "./Pages/ManageRequests";
import MealPlanRequests from "./Pages/MealPlanRequests";
import GenerateMealPlan from "./Pages/GenerateMealPlan";
import EditMealPlan from "./Pages/EditMealPlan";
import GeneratedMealPlan from './Pages/GeneratedMealPlan';
import ClientProgress from './Pages/ClientProgress';
import ClientRequests from './Pages/ClientRequests';
import Feedbacks from './Pages/Feedbacks';
import Payments from './Pages/Payments';
import ProtectedRoute from './components/ProtectedRoute';

export const ToggledContext = createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };

  return (
    <Router>
      <Context>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToggledContext.Provider value={values}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
                      <SideBar />
                      <Box
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          maxWidth: "100%",
                        }}
                      >
                        <Navbar />
                        <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/requests" element={<ManageRequests />} />
                            <Route path="/meal-plan-requests" element={<MealPlanRequests />} />
                            <Route path="/generate-meal-plan/:requestId" element={<GenerateMealPlan />} />
                            <Route path="/edit-meal-plan/:id" element={<EditMealPlan />} />
                            <Route path="/generated-meal/:requestId" element={<GeneratedMealPlan />} />
                            <Route path="/client-requests" element={<ClientRequests />} />
                            <Route path="/client-progress/:clientId" element={<ClientProgress />} />
                            <Route path="/request-progress/:requestId" element={<ClientProgress />} />
                            <Route path="/feedbacks" element={<Feedbacks />} />
                            <Route path="/payments" element={<Payments />} />
                            {/*<Route path="manage-nutritionists" element={<ManageNutri />} />
                            <Route path="add-nutritionist" element={<AddNutritionist/>} /> */}
                          </Routes>
                        </Box>
                      </Box>
                    </Box>
                  </ProtectedRoute>
                } />
              </Routes>
            </ToggledContext.Provider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </Context>
    </Router>
  );
}

export default App;
