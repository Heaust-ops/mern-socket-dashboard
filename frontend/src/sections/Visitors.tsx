import { Card, CardContent, Typography, Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useSocketEvent } from "../socket";
import { AnimatePresence, motion } from "framer-motion";
import constants from "../constants";

interface Visitor {
  _id?: string;
  ipAddress: string;
  browser: string;
  location: string;
  referrer: string;
  createdAt?: string;
}

interface VisitorsProps {}

const Visitors: FC<VisitorsProps> = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  const fetchVisitors = async () => {
    try {
      const response = await fetch(`${constants.serverURI}/api/v1/visitor`);
      if (!response.ok) {
        throw new Error("Failed to fetch visitors");
      }
      const data = await response.json();
      setVisitors(data["data"]);
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  useSocketEvent("server:visitor-update", setVisitors);

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <AnimatePresence>
          {visitors.map((visitor) => (
            <Grid
              animate
              layout
              component={motion.div}
              key={visitor._id!}
              item
              xs={12}
              sm={6}
              md={4}
            >
              <VisitorCard visitor={visitor} />
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <span></span>
    </>
  );
};

interface VisitorCardProps {
  visitor: Visitor;
}

const VisitorCard: FC<VisitorCardProps> = ({ visitor }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2">
          <strong>IP Address:</strong> {visitor.ipAddress}
        </Typography>
        <Typography variant="body2">
          <strong>Browser:</strong> {visitor.browser.split("/")[0]}
        </Typography>
        <Typography variant="body2">
          <strong>Location:</strong> {visitor.location}
        </Typography>
        <Typography variant="body2">
          <strong>Referrer:</strong> {visitor.referrer}
        </Typography>
        <Typography variant="body2">
          <strong>Timestamp:</strong> {visitor.createdAt!}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Visitors;
