/**
 * src/lib/models/Package.js — Mongoose model (ESM, cached for serverless)
 */
import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema(
  {
    title:        { type: String, required: [true, 'Title is required'], trim: true },
    slug:         { type: String, required: [true, 'Slug is required'], unique: true, lowercase: true, trim: true },
    category:     { type: String, required: [true, 'Category is required'], enum: ['Birthday','Anniversary','Baby Shower','Wedding','Engagement'] },
    subCategory:  { type: String, required: [true, 'Sub-category is required'], enum: ['Room Decoration','Balloon Arch','Car Boot','Canopy','Table Setup','Stage Decor','Photo Booth'] },
    description:  { type: String, trim: true, default: '' },
    price:        { type: Number, required: [true, 'Price is required'], min: 0 },
    originalPrice:{ type: Number, min: 0, default: 0 },
    badges:       { type: [String], enum: ['Best Seller','Trending'], default: [] },
    whatsIncluded:{ type: [String], default: [] },
    customizationOptions: { colors: { type: [String], default: [] } },
    images:       { type: [String], default: [] },
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:  { type: Number, default: 0, min: 0 },
    popularity:   { type: Number, default: 0, min: 0 },
    isActive:     { type: Boolean, default: true },
    faqs:         [{ q: { type: String, trim: true }, a: { type: String, trim: true } }],
  },
  { timestamps: true }
);

PackageSchema.virtual('discountPercent').get(function () {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});
PackageSchema.set('toJSON', { virtuals: true });
PackageSchema.set('toObject', { virtuals: true });
PackageSchema.index({ category: 1 });
PackageSchema.index({ subCategory: 1 });
PackageSchema.index({ popularity: -1 });

// Prevent model re-compilation error in serverless
const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);
export default Package;
