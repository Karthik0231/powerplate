import React, { useContext, useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Fade,
  useScrollTrigger,
  Slide,
  Divider,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Person,
  Restaurant,
  Assignment,
  FitnessCenter,
  Assessment,
  Star,
  PersonAdd,
  Login,
  RequestPage,
  Timeline,
  LocalDining,
  Settings,
  ArrowDropDown
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { userContext } from '../Context/Context';

// Hide on scroll behavior for the sticky header
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Pages configuration with icons and proper grouping
const guestPages = [
  { title: 'Register', path: '/register', icon: <PersonAdd fontSize="small" /> },
  { title: 'Login', path: '/login', icon: <Login fontSize="small" /> },
];

const userPages = [
  { title: 'Home', path: '/home', icon: <Restaurant fontSize="small" /> },
  { title: 'View Nutritionists', path: '/nutritionists', icon: <Person fontSize="small" /> },
  { title: 'Meal Plans', path: '/meal-plans', icon: <LocalDining fontSize="small" /> },
];

const Header = () => {
  const token=localStorage.getItem('userToken');
  const isAuthenticated = token !== null;
  const { LogoutUser, userData } = useContext(userContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for changing header appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  // User menu items based on your requirements
  const userMenuItems = [
    { title: 'Manage Profile', icon: <Settings />, action: () => navigate('/profile') },
    // { title: 'Request for Consultancy', icon: <RequestPage />, action: () => navigate('/consultancy-request') },
    { title: 'View Request Status', icon: <Assignment />, action: () => navigate('/request-status') },
    // { title: 'Apply for Meal Plan', icon: <LocalDining />, action: () => navigate('/apply-meal-plan') },
    // { title: 'Get the Meal Plan', icon: <Restaurant />, action: () => navigate('/my-meal-plan') },
    // { title: 'Update Progress', icon: <FitnessCenter />, action: () => navigate('/update-progress') },
    { title: 'Give Feedback and Ratings', icon: <Star />, action: () => navigate('/feedback') },
    { title: 'Logout', icon: <Logout />, action: LogoutUser }
  ];

  // Check if a path is active for highlighting current page in navigation
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Decide which pages to show based on authentication status
  const displayPages = isAuthenticated ? userPages : guestPages;

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
          backgroundImage: scrolled 
            ? 'linear-gradient(to right, #2e7d32, #43a047)'
            : 'linear-gradient(to right, #43a047, #66bb6a)',
          boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
          color: '#fff',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          zIndex: theme.zIndex.drawer + 1,
        }}
        elevation={scrolled ? 4 : 0}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: scrolled ? 0.5 : 1, transition: 'all 0.3s ease' }}>
            {/* Logo for larger screens */}
            <Restaurant sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: 30 }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              PowerPlate
            </Typography>

            {/* Mobile menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                edge="start"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': { 
                    borderRadius: 2, 
                    mt: 1.5,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
                TransitionComponent={Fade}
              >
                {displayPages.map((page) => (
                  <MenuItem 
                    key={page.title} 
                    onClick={() => handleMenuClick(page.path)}
                    sx={{
                      backgroundColor: isActive(page.path) ? 'rgba(67, 160, 71, 0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(67, 160, 71, 0.1)',
                        color: '#43a047'
                      },
                      borderLeft: isActive(page.path) ? '3px solid #43a047' : 'none',
                      color: isActive(page.path) ? '#43a047' : 'inherit'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {page.icon}
                      <Typography textAlign="center">{page.title}</Typography>
                    </Box>
                  </MenuItem>
                ))}

                {isAuthenticated && (
                  <Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                      User Actions
                    </Typography>
                    {userMenuItems.slice(0, 4).map((item) => (
                      <MenuItem 
                        key={item.title} 
                        onClick={() => {
                          item.action();
                          handleCloseNavMenu();
                        }}
                        sx={{
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: 'rgba(67, 160, 71, 0.1)',
                            color: '#43a047'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {React.cloneElement(item.icon, { fontSize: 'small' })}
                          <Typography>{item.title}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                    
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                      Progress & Feedback
                    </Typography>
                    {userMenuItems.slice(4).map((item) => (
                      <MenuItem 
                        key={item.title} 
                        onClick={() => {
                          item.action();
                          handleCloseNavMenu();
                        }}
                        sx={{
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: item.title === 'Logout' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(67, 160, 71, 0.1)',
                            color: item.title === 'Logout' ? '#f44336' : '#43a047'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {React.cloneElement(item.icon, { 
                            fontSize: 'small', 
                            sx: { color: item.title === 'Logout' ? '#f44336' : 'inherit' } 
                          })}
                          <Typography
                            sx={{ 
                              color: item.title === 'Logout' ? '#f44336' : 'inherit',
                              fontWeight: item.title === 'Logout' ? 500 : 'inherit'
                            }}
                          >
                            {item.title}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Box>
                )}
              </Menu>
            </Box>

            {/* Logo for mobile screens */}
            <Restaurant sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, fontSize: 24 }} />
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              PowerPlate
            </Typography>

            {/* Desktop navigation */}
            <Box sx={{ 
              flexGrow: 1, 
              display: { xs: 'none', md: 'flex' },
              justifyContent: isAuthenticated ? 'center' : 'flex-end'
            }}>
              {displayPages.map((page) => (
                <Button
                  key={page.title}
                  onClick={() => handleMenuClick(page.path)}
                  startIcon={page.icon}
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    display: 'flex',
                    mx: 1,
                    px: 2,
                    position: 'relative',
                    fontWeight: isActive(page.path) ? 600 : 400,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    '&::after': isActive(page.path) ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 7,
                      left: '50%',
                      width: '20px',
                      height: '3px',
                      backgroundColor: 'white',
                      transform: 'translateX(-50%)',
                      borderRadius: '3px'
                    } : {}
                  }}
                >
                  {page.title}
                </Button>
              ))}

              {/* Dropdown for additional user actions */}
              {/* {isAuthenticated && (
                <Button
                  onClick={handleOpenUserMenu}
                  endIcon={<ArrowDropDown />}
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    display: 'flex',
                    mx: 1,
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    }
                  }}
                >
                  Actions
                </Button>
              )} */}
            </Box>

            {/* User profile section */}
            {isAuthenticated && (
              <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                {/* Notifications badge */}
                <Tooltip title="Notifications">
                  <IconButton 
                    color="inherit" 
                    sx={{ mr: 1, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' } }}
                    onClick={() => navigate('/notifications')}
                  >
                    {/* <Badge badgeContent={3} color="error">
                      <Assessment />
                    </Badge> */}
                  </IconButton>
                </Tooltip>

                {/* User avatar and menu */}
                <Tooltip title="Account settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {userData?.profile ? (
                      <Avatar 
                        alt={userData.name} 
                        src={userData.profile}
                        sx={{ 
                          width: 40, 
                          height: 40,
                          border: '2px solid white',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            transition: 'transform 0.2s'
                          }
                        }}
                      />
                    ) : (
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            transition: 'transform 0.2s'
                          }
                        }}
                      >
                        <AccountCircle />
                      </Avatar>
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ 
                    mt: '45px',
                    '& .MuiPaper-root': { 
                      borderRadius: 2, 
                      minWidth: 220,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  TransitionComponent={Fade}
                >
                  {/* User info at top of dropdown */}
                  {userData && (
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {userData.name || 'User'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {userData.email || 'user@example.com'}
                      </Typography>
                    </Box>
                  )}
                  
                  {/* User menu items */}
                  <Box sx={{ py: 1 }}>
                    {userMenuItems.map((item, index) => (
                      <React.Fragment key={item.title}>
                        {index === 4 && (
                          <Divider sx={{ my: 1 }} />
                        )}
                        
                        <MenuItem 
                          onClick={() => {
                            item.action();
                            handleCloseUserMenu();
                          }}
                          sx={{
                            py: 1.5,
                            '&:hover': {
                              backgroundColor: item.title === 'Logout' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(67, 160, 71, 0.1)',
                              color: item.title === 'Logout' ? '#f44336' : '#43a047'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {React.cloneElement(item.icon, { 
                              fontSize: 'small', 
                              sx: { color: item.title === 'Logout' ? '#f44336' : 'inherit' } 
                            })}
                            <Typography
                              sx={{ 
                                color: item.title === 'Logout' ? '#f44336' : 'inherit',
                                fontWeight: item.title === 'Logout' ? 500 : 'inherit'
                              }}
                            >
                              {item.title}
                            </Typography>
                          </Box>
                        </MenuItem>
                      </React.Fragment>
                    ))}
                  </Box>
                </Menu>
              </Box>
            )}

            {/* Login/Register buttons for guests */}
            {/* {!isAuthenticated && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  startIcon={<Login />}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.5)', 
                    '&:hover': { 
                      borderColor: 'white', 
                      backgroundColor: 'rgba(255,255,255,0.1)' 
                    } 
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/register"
                  startIcon={<PersonAdd />}
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#43a047',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.9)', 
                    } 
                  }}
                >
                  Register
                </Button>
              </Box>
            )} */}
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;