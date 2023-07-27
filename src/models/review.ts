import mongoose, { Document, Schema } from 'mongoose';

interface IReview {
  title: string;
  content: string;
  rating: number;
}

// EXPORT INTERFACE WITH MONGOOSE DOCUMENT
export interface IReviewModel extends IReview, Document {}

// DEFINE REVIEW SCHEMA
const ReviewSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

// EXPORT THE MONGOOSE MODEL
export default mongoose.model<IReviewModel>('Review', ReviewSchema);