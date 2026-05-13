import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    packageId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true, index: true },
    userName:   { type: String, required: true, trim: true, maxlength: 80 },
    rating:     { type: Number, required: true, min: 1, max: 5 },
    text:       { type: String, required: true, trim: true, maxlength: 1000 },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export default Review;
