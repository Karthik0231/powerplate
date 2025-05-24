// App.jsx
import React, { createContext, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Dashboard, Navbar, SideBar } from "./scenes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Context from "./Context/Context";
import Nutritionists from "./Pages/Nutritionists";
import AddNutritionist from "./Pages/Add-nutritionist";
import ProtectedRoute from "./components/ProtectedRoute";
import Payments from "./Pages/PaymentsManage";
import Users from "./Pages/Users";
import Feedbacks from "./Pages/Feedbacks";

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
                            <Route path="nutritionists" element={<Nutritionists />} />
                            <Route path="add-nutritionist" element={<AddNutritionist/>} />
                            <Route path="payments" element={<Payments />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/feedbacks" element={<Feedbacks />} />
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
