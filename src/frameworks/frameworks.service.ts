import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FrameworkWriteDTO } from 'src/DTO/frameworkDTO';
import { Framework } from 'src/Models/framework.schema';
import { Guideline } from 'src/Models/guideline.schema';

@Injectable()
export class FrameworkService {
  
    constructor(@InjectModel('Framework') private frameworkModel: Model<any>) {}
    
    async createFramework(
        args: {
            framework: FrameworkWriteDTO
        }
    ): Promise<void> {
        const framework = new this.frameworkModel({ ...args.framework, _id: new Types.ObjectId()});
        await framework.save();
        return framework._id;
    }

    async updateFramework(
        args: {
            frameworkId: string,
            frameworkUpdates: any
        }
    ): Promise<void> {
        await this.frameworkModel.updateOne({ _id: new Types.ObjectId(args.frameworkId) }, { $set: { ...args.frameworkUpdates, lastUpdated: Date.now() }});
    }

    async getFrameworks(
        args: {
            query
        }
    ): Promise<Framework[]> {
        // TODO: Build query
        return await this.frameworkModel.find().exec();
    }

    async getSingleFramework(
        args: {
            frameworkId: string,
        }
    ): Promise<Framework> {
        return await this.frameworkModel.findOne({_id: args.frameworkId});
    }

    async createGuideline(
        args: {
            frameworkId: string,
            guideline: any
        }
    ): Promise<void> {
        throw Error('Method not implemented');
    }

    async updateGuideline(
        args: {
            frameworkId: string,
            guidelineId: string,
            guideline: any,
        }
    ): Promise<void> {
        throw Error('Method not implemented');
    }

    async deleteGuideline(
        args: {
            frameworkId: string,
            guidelineId: string,
        }
    ): Promise<void> {
        throw Error('Method not implemented');
    }

    async getSingleGuideline(
        args: {
            frameworkId: string,
            guidelineId: string,
        }
    ): Promise<Guideline> {
        throw Error('Method not implemented');
    }

    async getGuidelinesForFramework(
        args: {
            frameworkId: string,
        }
    ): Promise<Guideline[]>{
        throw Error('Method not implemented');
    }

    async getAllGuidelines(
        args: {
            query: any
        }
    ): Promise<Guideline []> {
        throw Error('Method not implemented');
    }
    
 
}