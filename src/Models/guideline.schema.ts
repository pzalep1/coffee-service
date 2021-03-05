import { Schema, Types } from 'mongoose';

export const GuidelineSchema = new Schema({
    _id: Types.ObjectId,
    frameworkId: String,
    name: String,
    guidelineText: String,
},
{
    collection: 'guidelines'
});

export interface Guideline {
    _id: string,
    frameworkName: string,
    year: string,
    author: string,
    name: string,
    guidelineText: string,
    
}