import { Schema, Types } from 'mongoose';

export const GuidelineSchema = new Schema({
    _id: Types.ObjectId,
    frameworkId: String,
    name: String,
    guidelineText: String,
    status: String,
    year: String,
    author: String,
    levels: [String],
},
{
    collection: 'guidelines'
});

GuidelineSchema.index({'$**': 'text'});

export interface Guideline {
    _id: string,
    frameworkName: string,
    year: string,
    author: string,
    name: string,
    guidelineText: string,
    
}