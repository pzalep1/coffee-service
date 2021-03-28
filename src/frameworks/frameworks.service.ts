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
        const framework = new this.frameworkModel(
            { 
                ...args.framework, 
                status: 'unreleased', 
                _id: new Types.ObjectId()
            }
        );
        await framework.save();
        return framework._id;
    }

    async updateFramework(
        args: {
            frameworkId: string,
            frameworkUpdates: any
        }
    ): Promise<void> {
        await this.validateFrameworkUpdates(args);
        const updated = await this.frameworkModel.updateOne(
            { _id: new Types.ObjectId(args.frameworkId) }, 
            { $set: { ...args.frameworkUpdates, lastUpdated: Date.now() }}
        );
        if(updated.nModified > 0) {
            return;
        } else {
            throw new HttpException('Guideline not found!', HttpStatus.NOT_FOUND);
        }
    }

    async getFrameworks(
        args: {
            query: any
        }
    ): Promise<Framework[]> {
        const aggregation = [];
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
            aggregation.push({ $match: { levels: { $in: args.query.level}}});
        }
        if(aggregation.length > 0) {
            return await this.frameworkModel.aggregate(aggregation).exec();
        } else {
            return await this.frameworkModel.find().exec();
        }
    }

    async getSingleFramework(
        args: {
            frameworkId: string,
        }
    ): Promise<Framework> {
        const framework = await this.frameworkModel.findOne(
            { _id: args.frameworkId }
        );
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
        const framework = await this.getSingleFramework({ frameworkId: args.frameworkId });
        const guideline = new this.guidelineModel(
            { 
                frameworkId: args.frameworkId,
                status: 'unreleased',
                year: framework.year,
                author: framework.author,
                ...args.guideline,
                 _id: new Types.ObjectId()
            }
        );
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
        await this.validateGuidelineUpdate(args);
        await this.guidelineModel.updateOne(
            { _id: new Types.ObjectId(args.guidelineId) }, 
            { $set: { ...args.guideline, lastUpdated: Date.now() }}
        ).exec();
    }

    async deleteGuideline(
        args: {
            frameworkId: string,
            guidelineId: string,
        }
    ): Promise<void> {
        await this.guidelineModel.deleteOne(
            {_id: new Types.ObjectId(args.guidelineId)}
        ).exec();;
    }

    async getSingleGuideline(
        args: {
            frameworkId: string,
            guidelineId: string,
        }
    ): Promise<Guideline> {
        return await this.guidelineModel.findOne(
            {_id: new Types.ObjectId(args.guidelineId)}
        ).exec();;
    }

    async getGuidelinesForFramework(
        args: {
            frameworkId: string,
        }
    ): Promise<Guideline[]>{
        return await this.guidelineModel.find(
            {frameworkId: args.frameworkId}
        ).exec();
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
    
    async validateFrameworkUpdates(args) {
        const framework = await this.getSingleFramework({ frameworkId: args.frameworkId });
        if (framework) {
            const updates = args.frameworkUpdates;
            if (updates.status && (updates.status !== 'unreleased' || updates.status !== 'released')) {
                throw new HttpException('Framework moving to invalid status', HttpStatus.BAD_REQUEST);
            }
            if (updates.year && (updates.year < '1998' && updates.year > '2030')) {
                throw new HttpException('Framework must have a year between 1998 and 2030', HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new HttpException('Framework not found!', HttpStatus.NOT_FOUND);
        }
    }

    async validateGuidelineUpdate(args) {
        const framework = await this.getSingleFramework({ frameworkId: args.frameworkId });
        if (framework) {
            const guideline = await this.getSingleGuideline({ frameworkId: args.frameworkId, guidelineId: args.guideline._id});
            if (guideline) {
                const updates = args.guideline;
                if(updates.status && (updates.status !== 'unreleased' || updates.status !== 'released')) {
                    throw new HttpException('Guideline moving to invalid status', HttpStatus.BAD_REQUEST);
                }
                if (updates.year && (updates.year < '1998' && updates.year > '2030')) {
                    throw new HttpException('Guideline must have a year between 1998 and 2030', HttpStatus.BAD_REQUEST);
                }
            }
        } else {
            throw new HttpException('Framework not found!', HttpStatus.NOT_FOUND);
        }
    }
 
}