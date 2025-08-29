import { Box, Typography } from "@mui/material";

import calendarDate from "../../assets/images/svg/calendar-date.svg"

const date = new Date().getDate();
const currentDay = date.toString().padStart(2, "0");

const DynamicCalendarIcon = () => {
  return (
    <Box
      position="relative"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      align-items="center"
    >
      <img src={calendarDate} alt="" className="sidebarImage"/>
      <Box position="absolute">
        <Typography variant="caption" fontWeight="bold" fontSize={"0.6rem"} color={"#1c274c"}>
          {currentDay}
        </Typography>
      </Box>
    </Box>
  );
};

export default DynamicCalendarIcon;