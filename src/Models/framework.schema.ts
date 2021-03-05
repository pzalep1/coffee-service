import { Schema, Types } from 'mongoose';

export const FrameworkSchema = new Schema({
    _id: Types.ObjectId, 
    name: String,
    year: String,
    author: String
},
{
    collection: 'frameworks'
});

export interface Framework {
    _id: string,
    name: string,
    year: string,
    author: string,
    guidelines: string[]
}