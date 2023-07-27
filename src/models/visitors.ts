import mongoose, { Document, Schema } from 'mongoose';

interface IVisitor {
    ipAddress: string;
    browser: string;
    location: string;
    referrer: string;
    timestamp: Date;
}

// EXPORT INTERFACE WITH MONGOOSE DOCUMENT
export interface IVisitorModel extends IVisitor, Document {}

// DEFINE VISITOR SCHEMA
const VisitorSchema: Schema = new Schema(
    {
        ipAddress: { type: String, required: true },
        browser: { type: String, required: true },
        location: { type: String, default: 'global' },
        referrer: { type: String, default: 'no-referrer' },
    },
    { timestamps: true }
);

// EXPORT THE MONGOOSE MODEL
export default mongoose.model<IVisitorModel>('Visitor', VisitorSchema);
