import { Injectable } from '@nestjs/common';
import { Framework } from 'src/Models/framework.schema';
import { Guideline } from 'src/Models/guideline.schema';

@Injectable()
export class FrameworkService {
  
    async createFramework(
        args: {
            framework: any
        }
    ): Promise<void> {
        throw Error('Method not implemented');
    }

    async updateFramework(
        args: {
            frameworkId: string,
            frameworkUpdates: any
        }
    ): Promise<void> {
        throw Error('Method not implemented');
    }

    async getFrameworks(
        args: {
            query
        }
    ): Promise<Framework[]> {
        throw Error('Method not implemented');
    }

    async getSingleFramework(
        args: {
            frameworkId: string,
        }
    ): Promise<Framework> {
        throw Error('Method not implemented');
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