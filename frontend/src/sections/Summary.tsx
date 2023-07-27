import { FC } from "react";
import SystemMonitor from "./SystemMonitor";
import Reviews from "./Reviews";
import Visitors from "./Visitors";
import { Typography } from "@mui/material";

interface SummaryProps {}

const Summary: FC<SummaryProps> = () => {
  return (
    <>
      <Typography variant="h3" fontWeight={600}>System:</Typography>
      <SystemMonitor />
      <Typography variant="h3" fontWeight={600}>Reviews:</Typography>
      <Reviews isPostable={false} />
      <Typography variant="h3" fontWeight={600}>Visitors:</Typography>
      <Visitors />
    </>
  );
};

export default Summary;
