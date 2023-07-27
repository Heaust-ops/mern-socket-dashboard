import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Container,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PeopleIcon from "@mui/icons-material/People";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Summary from "./sections/Summary";
import SystemMonitor from "./sections/SystemMonitor";
import Visitors from "./sections/Visitors";
import Reviews from "./sections/Reviews";

const sections = [
  { label: "Summary", icon: <HomeIcon /> },
  { label: "System Monitor", icon: <EqualizerIcon /> },
  { label: "Reviews", icon: <RateReviewIcon /> },
  { label: "Visitors", icon: <PeopleIcon /> },
];

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [page, setPage] = useState(0);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const isMobile = useMediaQuery("(max-width: 1024px)");

  const contentLayout = isMobile
    ? {}
    : { marginLeft: "25rem", width: "calc(100% - 25rem)" };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar sx={contentLayout} color="primary" position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {["Summary", "System Monitor", "Reviews", "Visitors"][page]}{" "}
            Dashboard
          </Typography>
          <IconButton onClick={toggleDarkMode}>
            {darkMode ? <Brightness7Icon /> : <Brightness3Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      {isMobile ? (
        <BottomNavigation
          value={page}
          onChange={(_, value) => setPage(value)}
          showLabels
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999 }}
        >
          {sections.map((section, index) => (
            <BottomNavigationAction
              key={index}
              label={section.label.split(" ")[0]}
              icon={section.icon}
            />
          ))}
        </BottomNavigation>
      ) : (
        <nav>
          <Drawer
            PaperProps={{
              sx: { width: "25rem" },
            }}
            variant="permanent"
          >
            <Typography
              align="center"
              color="gray"
              sx={{ margin: "1rem" }}
              variant="h5"
              fontWeight={900}
            >
              Real Time Dashboard
            </Typography>
            <hr style={{ width: "80%", opacity: "0.5" }} />
            <List>
              {sections.map((section, index) => (
                <ListItem key={index}>
                  <Button
                    onClick={() => setPage(index)}
                    sx={{ width: "100%", padding: "1rem" }}
                  >
                    <ListItemIcon>{section.icon}</ListItemIcon>
                    <ListItemText
                      sx={{ textAlign: "left" }}
                      primary={section.label}
                    />
                  </Button>
                </ListItem>
              ))}
            </List>
          </Drawer>
        </nav>
      )}
      <Container
        sx={{
          paddingTop: "20px",
          wordBreak: "break-all",
          ...contentLayout,
        }}
      >
        {[<Summary />, <SystemMonitor />, <Reviews />, <Visitors />][page]}
      </Container>
    </ThemeProvider>
  );
};

export default App;
