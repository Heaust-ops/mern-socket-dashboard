import {
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  Rating,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { FC, useEffect, useState } from "react";
import constants from "../constants";
import { socket, useSocketEvent } from "../socket";
import { AnimatePresence, motion } from "framer-motion";

interface ReviewsProps {
  isPostable?: boolean;
}

const Reviews: FC<ReviewsProps> = ({ isPostable = true }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${constants.serverURI}/api/v1/review`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data["data"]);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useSocketEvent("server:review-update", setReviews);

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        {isPostable && <PostReview />}
        <AnimatePresence>
          {reviews.map((review) => (
            <Grid
              animate
              layout
              component={motion.div}
              key={review._id!}
              item
              xs={12}
              sm={6}
              md={4}
            >
              <Review review={review} />
            </Grid>
          ))}
        </AnimatePresence>
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
      </Grid>
    </>
  );
};

export default Reviews;

interface Review {
  _id?: string;
  title: string;
  content: string;
  rating: number;
}

interface ReviewProps {
  review: Review;
}

const Review: FC<ReviewProps> = ({ review }) => {
  const deleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(
        `${constants.serverURI}/api/v1/review/${reviewId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      socket.emit("client:review-update");
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <Card>
      <CardHeader
        title={review.title}
        action={
          <IconButton
            aria-label="delete"
            onClick={() => deleteReview(review._id!)}
          >
            <DeleteIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          {review.content}
        </Typography>
        <br />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {Array.from({ length: review.rating }).map((_, index) => (
            <StarIcon key={index} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

//

const PostReview: FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState<number | null>(null);

  const onPostReview = async (newReview: Review) => {
    if (!title) return;
    if (!description) return;
    if (stars === null) return;

    try {
      const response = await fetch(`${constants.serverURI}/api/v1/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });
      if (!response.ok) {
        throw new Error("Failed to post review");
      }
      socket.emit("client:review-update");
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  const handlePost = () => {
    if (!title || !description || stars === null) return;
    const newReview: Review = {
      title,
      content: description,
      rating: stars,
    };
    onPostReview(newReview);
    // Clear input fields after posting review
    setTitle("");
    setDescription("");
    setStars(null);
  };

  return (
    <Card sx={{ width: "100%", marginLeft: "1rem", marginTop: "1rem" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Post a Review
        </Typography>
        <br />
        <TextField
          label="Title"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <br />
        <TextField
          label="Description"
          fullWidth
          multiline
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <br />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Rating
            name="stars"
            value={stars}
            onChange={(_, newValue) => {
              setStars(newValue);
            }}
          />
          <Button variant="contained" color="primary" onClick={handlePost}>
            Post Review
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
