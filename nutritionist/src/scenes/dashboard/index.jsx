import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Fade,
  Grow,
  Slide,
} from "@mui/material";
import {
  Header,
  StatBox,
  LineChart,
  ProgressCircle,
} from "../../components";
import {
  PersonOutlined,
  RestaurantOutlined,
  StarOutlined,
  LocalAtmOutlined,
  AssignmentOutlined,
  PendingActionsOutlined,
  TrendingUpOutlined,
  PaymentOutlined,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import { useContext, useEffect, useState } from "react";
import { NutritionistContext } from "../../Context/Context";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");

  const {
    getAssignedClients,
    getMealPlanRequests,
    getNutritionistMealPlans,
    getNutritionistFeedbacks,
    getNutritionistPayments
  } = useContext(NutritionistContext);

  const [stats, setStats] = useState({
    // totalClients: 0,
    totalMealPlans: 0,
    totalFeedbacks: 0,
    totalPayments: 0,
    pendingRequests: 0,
    completedPlans: 0,
    averageRating: 0,
    recentTransactions: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch all required data
        // const clients = await getAssignedClients() || [];
        const mealPlans = await getMealPlanRequests() || [];
        const generatedPlans = await getMealPlanRequests() || [];
        const feedbacks = await getNutritionistFeedbacks() || [];
        const payments = await getNutritionistPayments() || [];

        // Calculate statistics
        const pendingRequests = mealPlans.filter(plan => plan.status === 'pending').length;
        const completedPlans = generatedPlans.filter(plan => plan.status === 'created').length;
        const averageRating = feedbacks.length > 0 
          ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length
          : 0;

       const totalEarnings = payments.reduce((sum, payment) =>
  payment.status === 'paid' ? sum + payment.amount : sum
, 0);


        setStats({
          // totalClients: clients.length,
          totalMealPlans: generatedPlans.length,
          totalFeedbacks: feedbacks.length,
          totalPayments: totalEarnings,
          pendingRequests,
          completedPlans,
          averageRating,
          recentTransactions: payments.slice(0, 5) // Get last 5 payments
        });

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, subtitle, value, icon, progress, delay = 0, trend }) => (
    <Grow in={!loading} timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
      <Card
        sx={{
          background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.primary[300]}`,
          borderRadius: '16px',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${colors.primary[900]}40`,
            border: `1px solid ${colors.greenAccent[500]}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
          }
        }}
      >
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography 
                variant="h3" 
                fontWeight="700" 
                color={colors.gray[100]}
                sx={{ 
                  mb: 1,
                  background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {value}
              </Typography>
              <Typography variant="body1" color={colors.gray[300]} fontWeight="500">
                {subtitle}
              </Typography>
            </Box>
            <Box
              sx={{
                background: `linear-gradient(135deg, ${colors.greenAccent[500]}20, ${colors.blueAccent[500]}20)`,
                borderRadius: '12px',
                p: 1.5,
                backdrop: 'blur(10px)',
              }}
            >
              {icon}
            </Box>
          </Box>
          
          {progress !== undefined && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.primary[600],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
                  },
                }}
              />
            </Box>
          )}

          {trend && (
            <Box display="flex" alignItems="center" mt={1}>
              <TrendingUpOutlined sx={{ color: colors.greenAccent[500], fontSize: '16px', mr: 0.5 }} />
              <Typography variant="caption" color={colors.greenAccent[500]} fontWeight="600">
                {trend}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grow>
  );

  return (
    <Box m="20px">
      <Fade in timeout={800}>
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Header title="DASHBOARD" subtitle="Welcome to your nutritionist dashboard" />
        </Box>
      </Fade>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={
          isXlDevices
            ? "repeat(12, 1fr)"
            : isMdDevices
            ? "repeat(6, 1fr)"
            : "repeat(3, 1fr)"
        }
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Enhanced Statistic Cards */}
        <Box gridColumn="span 3">
          <StatCard
            value={stats.totalMealPlans.toString()}
            subtitle="Meal Plans Created"
            progress={1}
            delay={100}
            // trend="+12% this month"
            icon={<RestaurantOutlined sx={{ color: colors.greenAccent[500], fontSize: "28px" }} />}
          />
        </Box>

        <Box gridColumn="span 3">
          <StatCard
            value={stats.averageRating.toFixed(1)}
            subtitle="Average Rating"
            progress={stats.averageRating / 5}
            delay={200}
            // trend="Excellent feedback"
            icon={<StarOutlined sx={{ color: colors.greenAccent[500], fontSize: "28px" }} />}
          />
        </Box>

        <Box gridColumn="span 3">
          <StatCard
            value={`₹${stats.totalPayments.toLocaleString()}`}
            subtitle="Total Earnings"
            progress={1}
            delay={300}
            // trend="+18% this month"
            icon={<LocalAtmOutlined sx={{ color: colors.greenAccent[500], fontSize: "28px" }} />}
          />
        </Box>

        {/* <Box gridColumn="span 3">
          <StatCard
            value={stats.pendingRequests.toString()}
            subtitle="Pending Requests"
            delay={400}
            icon={<PendingActionsOutlined sx={{ color: colors.redAccent[500], fontSize: "28px" }} />}
          />
        </Box> */}

        {/* Enhanced Recent Transactions */}
        <Slide in={!loading} direction="up" timeout={1000} style={{ transitionDelay: '500ms' }}>
          <Box
            gridColumn={isXlDevices ? "span 8" : "span 12"}
            gridRow="span 3"
          >
            <Card
              sx={{
                background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${colors.primary[300]}`,
                borderRadius: '16px',
                height: '100%',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 12px 24px ${colors.primary[900]}30`,
                },
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  background: `linear-gradient(90deg, ${colors.greenAccent[500]}10, ${colors.blueAccent[500]}10)`,
                  borderBottom: `1px solid ${colors.primary[600]}`,
                  p: 3,
                }}
              >
                <Box display="flex" alignItems="center">
                  <PaymentOutlined sx={{ color: colors.greenAccent[500], fontSize: "24px", mr: 1 }} />
                  <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                    Recent Payments
                  </Typography>
                </Box>
                <Chip
                  label={`${stats.recentTransactions.length} transactions`}
                  size="small"
                  sx={{
                    background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
                    color: 'white',
                    fontWeight: '600',
                  }}
                />
              </Box>

              <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                {stats.recentTransactions.length === 0 ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="200px"
                    flexDirection="column"
                  >
                    <PaymentOutlined sx={{ color: colors.gray[600], fontSize: "48px", mb: 2 }} />
                    <Typography color={colors.gray[500]} variant="h6">
                      No recent transactions
                    </Typography>
                  </Box>
                ) : (
                  stats.recentTransactions.map((payment, i) => (
                    <Fade in key={i} timeout={800} style={{ transitionDelay: `${600 + i * 100}ms` }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          borderBottom: `1px solid ${colors.primary[600]}`,
                          p: 3,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: `${colors.primary[600]}30`,
                            transform: 'translateX(8px)',
                          },
                          '&:last-child': {
                            borderBottom: 'none',
                          }
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: colors.greenAccent[500],
                              mr: 2,
                              width: 48,
                              height: 48,
                              background: `linear-gradient(135deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
                            }}
                          >
                            {payment.client?.name?.charAt(0) || 'C'}
                          </Avatar>
                          <Box>
                            <Typography color={colors.gray[100]} variant="h6" fontWeight="600">
                              {payment.client?.name || 'Unknown Client'}
                            </Typography>
                            <Typography color={colors.gray[400]} variant="body2">
                              {payment.client?.email || 'No email'}
                            </Typography>
                          </Box>
                        </Box>

                        <Box textAlign="right">
                          <Typography color={colors.gray[300]} variant="body2" sx={{ mb: 0.5 }}>
                            {new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </Typography>
                          <Chip
                            label={`₹${payment.amount.toLocaleString()}`}
                            sx={{
                              background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.greenAccent[600]})`,
                              color: 'white',
                              fontWeight: '700',
                              fontSize: '0.9rem',
                            }}
                          />
                        </Box>
                      </Box>
                    </Fade>
                  ))
                )}
              </Box>
            </Card>
          </Box>
        </Slide>

        {/* Quick Stats Panel */}
        <Slide in={!loading} direction="left" timeout={1000} style={{ transitionDelay: '600ms' }}>
          <Box
            gridColumn={isXlDevices ? "span 4" : "span 12"}
            gridRow="span 3"
          >
            <Card
              sx={{
                background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${colors.primary[300]}`,
                borderRadius: '16px',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  background: `linear-gradient(90deg, ${colors.blueAccent[500]}10, ${colors.greenAccent[500]}10)`,
                  borderBottom: `1px solid ${colors.primary[600]}`,
                  p: 3,
                }}
              >
                <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                  Quick Overview
                </Typography>
              </Box>

              <Box p={3} display="flex" flexDirection="column" gap={3}>
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography color={colors.gray[300]} variant="body1">
                      Completed Plans
                    </Typography>
                    <Typography color={colors.greenAccent[500]} variant="h6" fontWeight="600">
                      {stats.completedPlans}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.completedPlans / (stats.totalMealPlans || 1)) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.primary[600],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor: colors.greenAccent[500],
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography color={colors.gray[300]} variant="body1">
                      Total Feedbacks
                    </Typography>
                    <Typography color={colors.blueAccent[500]} variant="h6" fontWeight="600">
                      {stats.totalFeedbacks}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((stats.totalFeedbacks / (stats.totalMealPlans || 1)) * 100, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.primary[600],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor: colors.blueAccent[500],
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${colors.greenAccent[500]}10, ${colors.blueAccent[500]}10)`,
                    borderRadius: '12px',
                    p: 2,
                    mt: 2,
                  }}
                >
                  <Typography color={colors.gray[100]} variant="h6" fontWeight="600" mb={1}>
                    Performance Metrics
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color={colors.gray[300]} variant="body2">
                      Success Rate
                    </Typography>
                    <Typography color={colors.greenAccent[500]} variant="body2" fontWeight="600">
                      {stats.totalMealPlans > 0 ? Math.round((stats.completedPlans / stats.totalMealPlans) * 100) : 0}%
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color={colors.gray[300]} variant="body2">
                      Client Satisfaction
                    </Typography>
                    <Typography color={colors.greenAccent[500]} variant="body2" fontWeight="600">
                      {stats.averageRating > 0 ? `${Math.round((stats.averageRating / 5) * 100)}%` : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        </Slide>
      </Box>
    </Box>
  );
}

export default Dashboard;