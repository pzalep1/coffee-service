import { Schema, Types } from 'mongoose';

export const FrameworkSchema = new Schema({
    _id: Types.ObjectId, 
    name: String,
    year: String,
    author: String,
    status: String,
    levels: [String],
},
{
    collection: 'frameworks'
});

FrameworkSchema.index({'$**': 'text'});

export interface Framework {
    _id: string,
    name: string,
    year: string,
    author: string,
    status: string,
    levels: string [],
    guidelines: string[],
}