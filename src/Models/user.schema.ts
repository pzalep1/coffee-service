import { Schema, Types } from 'mongoose';

export const UserSchema = new Schema({
    _id: Types.ObjectId,
    email: String,
    password: String,
    organization: String, 
    name: String,
},
{
    collection: 'users'
});

export interface User {
    _id: string,
    email: string,
    name: string,
    organization: string,
    password: string,
}