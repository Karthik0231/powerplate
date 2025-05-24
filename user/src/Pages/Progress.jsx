// import React, { useContext, useEffect, useState } from 'react';
// import { Box, Typography, Grid, Paper, TextField } from '@mui/material';
// import { userContext } from '../Context/Context';
// import PageContainer from '../components/PageContainer';
// import CustomButton from '../components/CustomButton';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// const Progress = () => {
//   const { updateProgress, progress } = useContext(userContext);
//   const [formData, setFormData] = useState({
//     weight: '',
//     height: '',
//     notes: ''
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     updateProgress(formData);
//   };

//   return (
//     <PageContainer title="Progress Tracking" maxWidth="lg">
//       <Grid container spacing={4}>
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom>Update Progress</Typography>
//             <Box component="form" onSubmit={handleSubmit}>
//               <TextField
//                 fullWidth
//                 label="Current Weight (kg)"
//                 type="number"
//                 margin="normal"
//                 value={formData.weight}
//                 onChange={(e) => setFormData({...formData, weight: e.target.value})}
//               />
//               <TextField
//                 fullWidth
//                 label="Current Height (cm)"
//                 type="number"
//                 margin="normal"
//                 value={formData.height}
//                 onChange={(e) => setFormData({...formData, height: e.target.value})}
//               />
//               <TextField
//                 fullWidth
//                 label="Notes"
//                 multiline
//                 rows={4}
//                 margin="normal"
//                 value={formData.notes}
//                 onChange={(e) => setFormData({...formData, notes: e.target.value})}
//               />
//               <CustomButton
//                 text="Update Progress"
//                 type="submit"
//                 sx={{ mt: 2 }}
//               />
//             </Box>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom>Progress Chart</Typography>
//             <LineChart width={500} height={300} data={progress}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="weight" stroke="#8884d8" />
//             </LineChart>
//           </Paper>
//         </Grid>
//       </Grid>
//     </PageContainer>
//   );
// };

// export default Progress;