import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../Models/user.schema';
@Injectable()
export class UserService {  
    constructor(@InjectModel('User') private userModel: Model<any>) {}
  
    async register(user: User): Promise<string> {
        // Check that user is valid
        if(user && user.email !== undefined && user.password !== undefined && user.organization !== undefined && user.name !== undefined) {
            // Check that user email is not already in use
            const email = user.email;
            const found = await this.userModel.findOne({ email }).exec();
            console.log(found);
            if (found) {                      
                // Salt password
                const saltRounds = 10;
                const password = user.password;
                const hash = await bcrypt.hash(password, saltRounds)
                user.password = hash;              
                const userDoc = new this.userModel({ ...user, _id: new Types.ObjectId()});
                await userDoc.save();
                this.login(user);
            } else {
                throw new HttpException('Email already in use!', HttpStatus.CONFLICT);
            }
        } else {
            throw new HttpException('Body must contain email, password, organization, and name', HttpStatus.BAD_REQUEST);
        }
        return 'yee';
    }

    async login(user: User): Promise<string> {
        // Check that the user has sent up the email and password
        // Check that the user exists 
        // Check that password match
        // generate token (jwt or passport*)
        // return the token to get returned to the client
        if(user && user.email !== undefined && user.password !== undefined)
        {
          const email = user.email;
          const password = user.password;
          const bFoundUser = await this.userModel.find({ email }).exec();
        }
        return user.name;
    }

    async getUsers(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async getSingleUser(email: string): Promise<User> {
        return await this.userModel.findOne({ email }).exec();
    }
}