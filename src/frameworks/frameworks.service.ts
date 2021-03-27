import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { query } from 'express';
import { Model, Types } from 'mongoose';
import { FrameworkWriteDTO } from 'src/DTO/frameworkDTO';
import { Framework } from 'src/Models/framework.schema';
import { Guideline } from 'src/Models/guideline.schema';

@Injectable()
export class FrameworkService {
  
    constructor(@InjectModel('Framework') private frameworkModel: Model<any>, @InjectModel('Guideline') private guidelineModel: Model<any>) {}
    
    async createFramework(
        args: {
            framework: FrameworkWriteDTO
        }
    ): Promise<void> {
        const framework = new this.frameworkModel({ ...args.framework, status: 'unreleased', _id: new Types.ObjectId()});
        await framework.save();
        return framework._id;
    }

    async updateFramework(
        args: {
            frameworkId: string,
            frameworkUpdates: any
        }
    ): Promise<void> {
        const updated = await this.frameworkModel.updateOne({ _id: new Types.ObjectId(args.frameworkId) }, { $set: { ...args.frameworkUpdates, lastUpdated: Date.now() }});
        if(updated.nModified > 0) {
            return;
        } else {
            throw new HttpException('Framework not found!', HttpStatus.NOT_FOUND);
        }
    }

    async getFrameworks(
        args: {
            query: any
        }
    ): Promise<Framework[]> {
        const aggregation = [];
        // TODO: Build query
        if(args.query.text) {
            aggregation.push({ $match: { $text: {$search: args.query.text}}},
                { $sort: { score: { $meta: 'textScore' }}});
        }
        if(args.query.year) {
            aggregation.push({ $match: { year: args.query.year }});
        }
        if(args.query.status) {
            aggregation.push({ $match: { status: args.query.status}});
        }
        if(args.query.level) {
            args.query.level = [args.query.level];
            console.log(args.query.level)
            aggregation.push({ $match: { levels: { $in: args.query.level}}});
        }
        return await this.frameworkModel.aggregate(aggregation).exec();
    }

    async getSingleFramework(
        args: {
            frameworkId: string,
        }
    ): Promise<Framework> {
        const framework = await this.frameworkModel.findOne({_id: args.frameworkId});
        if(framework) {
            return framework;
        } else {
            throw new HttpException('Framework not found!', HttpStatus.NOT_FOUND);
        }
    }

    async createGuideline(
        args: {
            frameworkId: string,
            guideline: any
        }
    ): Promise<void> {
        const guideline = new this.guidelineModel({ frameworkId: args.frameworkId, name: args.guideline.name, guidelineText: args.guideline.guidelineText, _id: new Types.ObjectId()});
        await guideline.save();
        return guideline._id;
    }

    async updateGuideline(
        args: {
            frameworkId: string,
            guidelineId: string,
            guideline: any,
        }
    ): Promise<void> {
        await this.guidelineModel.updateOne({ _id: new Types.ObjectId(args.guidelineId) }, { $set: { ...args.guideline, lastUpdated: Date.now() }}).exec();;
    }

    async deleteGuideline(
        args: {
            frameworkId: string,
            guidelineId: string,
        }
    ): Promise<void> {
        await this.guidelineModel.deleteOne({_id: new Types.ObjectId(args.guidelineId)}).exec();;
    }

    async getSingleGuideline(
        args: {
            frameworkId: string,
            guidelineId: string,
        }
    ): Promise<Guideline> {
        return await this.guidelineModel.findOne({_id: new Types.ObjectId(args.guidelineId)}).exec();;
    }

    async getGuidelinesForFramework(
        args: {
            frameworkId: string,
        }
    ): Promise<Guideline[]>{
        return await this.guidelineModel.find({frameworkId: args.frameworkId}).exec();
    }

    async getAllGuidelines(
        args: {
            query: any
        }
    ): Promise<Guideline []> {
        if(args.query.year) {

        }
        if(args.query.level) {

        }
        if(args.query.status) {

        }
        if(args.query.text) {
            
        }
        return await this.guidelineModel.find().exec();
    }
    
 
}