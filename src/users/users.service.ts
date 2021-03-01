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
        if(user.email !== undefined && user.password !== undefined && user.organization !== undefined && user.name !== undefined) {
            // Check that user email is not already in use
            const email = user.email;
            const found = await this.userModel.find({ email }).exec();
            console.log(found);
            if (found) {                      
                // Salt password
                const saltRounds = 10;
                const password = user.password;
                const hash = await bcrypt.hash(password, saltRounds)
                user.password = hash;              
                const userDoc = new this.userModel({ ...user, _id: new Types.ObjectId()});
                await userDoc.save();
                // this.login(user);
            } else {
                throw new HttpException('Email already in use!', HttpStatus.CONFLICT);
            }
        } else {
            throw new HttpException('Body must contain email, password, organization, and name', HttpStatus.BAD_REQUEST);
        }
        return 'yee';
    }

    async login(user: User): Promise<string> {
        return user.name;
    }
}