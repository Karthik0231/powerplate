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
  People,
  Person,
  Restaurant,
  RateReview,
  PersonOutlined,
  RestaurantOutlined,
  StarOutlined,
  LocalAtmOutlined,
  AssignmentOutlined,
  PendingActionsOutlined,
  TrendingUpOutlined,
  FeedbackOutlined,
  AdminPanelSettingsOutlined,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../Context/Context";
import axios from "axios";
import { config } from "../../Config/Config";

function Dashboard() {
  const theme = useTheme();
  const { host } = config;
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");

  const { viewUsers, viewNutritionists, viewFeedbacks } = useContext(AdminContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNutritionists: 0,
    totalFeedbacks: 0,
    activeNutritionists: 0,
    recentFeedbacks: [],
    recentTransactions: [],
    progressRatio: 0,
    averageRating: 0,
    pendingApprovals: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        
        // Use the same endpoint as in Nutritionists.jsx
        const nutritionistsResponse = await axios.get(
          `${host}/admin/nutritionists`,
          { headers: { 'auth-token': token } }
        );
        
        const users = await viewUsers() || [];
        const feedbacks = await viewFeedbacks() || [];
        
        // Get nutritionists from the response
        const nutritionists = nutritionistsResponse.data.success ? 
          nutritionistsResponse.data.nutritionists : [];

        // Calculate active nutritionists using the same status check as Nutritionists.jsx
        const activeNutritionists = nutritionists.filter(n => 
          n.status === 'active'
        ).length;

        // Calculate pending approvals
        const pendingApprovals = nutritionists.filter(n => 
          n.status === 'pending'
        ).length;

        // Calculate progress ratio
        const progressRatio = nutritionists.length > 0 ? 
          activeNutritionists / nutritionists.length : 0;

        // Calculate average rating from feedbacks
        const averageRating = feedbacks.length > 0 
          ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length
          : 0;

        // Debug log
        console.log('Admin Dashboard Stats:', {
          total: nutritionists.length,
          active: activeNutritionists,
          pending: pendingApprovals,
          ratio: progressRatio,
          averageRating: averageRating,
        });

        setStats({
          totalUsers: users.length,
          totalNutritionists: nutritionists.length,
          totalFeedbacks: feedbacks.length,
          activeNutritionists,
          pendingApprovals,
          recentFeedbacks: feedbacks.slice(0, 5),
          progressRatio,
          averageRating
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
          <Header title="ADMIN DASHBOARD" subtitle="Welcome to Powerplate Admin Dashboard" />
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
            value={stats.totalUsers.toString()}
            subtitle="Total Users"
            progress={1}
            delay={100}
            // trend="+15% this month"
            icon={<People sx={{ color: colors.greenAccent[500], fontSize: "28px" }} />}
          />
        </Box>

        <Box gridColumn="span 3">
          <StatCard
            value={stats.totalNutritionists.toString()}
            subtitle="Total Nutritionists"
            progress={1}
            delay={200}
            // trend="+8% this month"
            icon={<Person sx={{ color: colors.greenAccent[500], fontSize: "28px" }} />}
          />
        </Box>

        <Box gridColumn="span 3">
          <StatCard
            value={stats.activeNutritionists.toString()}
            subtitle="Active Nutritionists"
            progress={stats.progressRatio || 0}
            delay={300}
            trend={`${Math.round((stats.progressRatio || 0) * 100)}% active`}
            icon={<Restaurant sx={{ color: colors.greenAccent[500], fontSize: "28px" }} />}
          />
        </Box>

        <Box gridColumn="span 3">
          <StatCard
            value={stats.averageRating.toFixed(1)}
            subtitle="Platform Rating"
            progress={stats.averageRating / 5}
            delay={400}
            trend={`${Math.round((stats.averageRating / 5) * 100)}% positive`}
            icon={<StarOutlined sx={{ color: colors.greenAccent[500], fontSize: "28px" }} />}
          />
        </Box>

        {/* Enhanced Recent Feedbacks */}
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
                  <FeedbackOutlined sx={{ color: colors.greenAccent[500], fontSize: "24px", mr: 1 }} />
                  <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                    Recent Feedbacks
                  </Typography>
                </Box>
                <Chip
                  label={`${stats.recentFeedbacks.length} recent`}
                  size="small"
                  sx={{
                    background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
                    color: 'white',
                    fontWeight: '600',
                  }}
                />
              </Box>

              <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                {stats.recentFeedbacks.length === 0 ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="200px"
                    flexDirection="column"
                  >
                    <FeedbackOutlined sx={{ color: colors.gray[600], fontSize: "48px", mb: 2 }} />
                    <Typography color={colors.gray[500]} variant="h6">
                      No recent feedbacks
                    </Typography>
                  </Box>
                ) : (
                  stats.recentFeedbacks.map((feedback, i) => (
                    <Fade in key={feedback._id} timeout={800} style={{ transitionDelay: `${600 + i * 100}ms` }}>
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
                            {feedback.client?.name?.charAt(0) || 'C'}
                          </Avatar>
                          <Box>
                            <Typography color={colors.gray[100]} variant="h6" fontWeight="600">
                              {feedback.client?.name || 'Unknown Client'}
                            </Typography>
                            <Typography color={colors.gray[400]} variant="body2">
                              For: {feedback.nutritionist?.name || 'Unknown Nutritionist'}
                            </Typography>
                          </Box>
                        </Box>

                        <Box textAlign="right">
                          <Typography color={colors.gray[300]} variant="body2" sx={{ mb: 0.5 }}>
                            {new Date(feedback.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </Typography>
                          <Chip
                            label={`⭐ ${feedback.rating}/5`}
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

        {/* Platform Overview Panel */}
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
                <Box display="flex" alignItems="center">
                  <AdminPanelSettingsOutlined sx={{ color: colors.greenAccent[500], fontSize: "24px", mr: 1 }} />
                  <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                    Platform Overview
                  </Typography>
                </Box>
              </Box>

              <Box p={3} display="flex" flexDirection="column" gap={3}>
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography color={colors.gray[300]} variant="body1">
                      Active Nutritionists
                    </Typography>
                    <Typography color={colors.greenAccent[500]} variant="h6" fontWeight="600">
                      {stats.activeNutritionists}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.progressRatio || 0) * 100}
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
                    value={Math.min((stats.totalFeedbacks / Math.max(stats.totalUsers, 1)) * 100 * 10, 100)}
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

                {stats.pendingApprovals > 0 && (
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography color={colors.gray[300]} variant="body1">
                        Pending Approvals
                      </Typography>
                      <Typography color={colors.redAccent[500]} variant="h6" fontWeight="600">
                        {stats.pendingApprovals}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(stats.pendingApprovals / Math.max(stats.totalNutritionists, 1)) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: colors.primary[600],
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: colors.redAccent[500],
                        },
                      }}
                    />
                  </Box>
                )}

                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${colors.greenAccent[500]}10, ${colors.blueAccent[500]}10)`,
                    borderRadius: '12px',
                    p: 2,
                    mt: 2,
                  }}
                >
                  <Typography color={colors.gray[100]} variant="h6" fontWeight="600" mb={1}>
                    Platform Metrics
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color={colors.gray[300]} variant="body2">
                      Activation Rate
                    </Typography>
                    <Typography color={colors.greenAccent[500]} variant="body2" fontWeight="600">
                      {stats.totalNutritionists > 0 ? Math.round((stats.activeNutritionists / stats.totalNutritionists) * 100) : 0}%
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color={colors.gray[300]} variant="body2">
                      User Satisfaction
                    </Typography>
                    <Typography color={colors.greenAccent[500]} variant="body2" fontWeight="600">
                      {stats.averageRating > 0 ? `${Math.round((stats.averageRating / 5) * 100)}%` : 'N/A'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color={colors.gray[300]} variant="body2">
                      Growth Rate
                    </Typography>
                    <Typography color={colors.greenAccent[500]} variant="body2" fontWeight="600">
                      +12%
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