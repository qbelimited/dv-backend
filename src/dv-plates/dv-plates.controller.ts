import { Controller, Post, UploadedFiles, UseInterceptors, Res, Get, Query } from '@nestjs/common';
import { DVSerialService } from './dv-plates.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import { Express } from 'express';

@Controller('dv-serial')
export class DVSerialController {
  constructor(private readonly dvSerialService: DVSerialService) {}

  @Post('parse-file')
  // Use AnyFilesInterceptor to handle dynamic file fields (file0, file1, ..., file99)
  @UseInterceptors(AnyFilesInterceptor()) // Handles all dynamic file fields
  async parseFile(@UploadedFiles() files: Express.Multer.File[], @Res() res: Response) {
    try {
      if (!files || files.length === 0) {
        return res.status(400).json({
          message: 'No files uploaded',
        });
      }

      const allEntries = [];
      for (const file of files) {
        const fileContent = await this.dvSerialService.readFileContent(file);
        const entries = this.dvSerialService.parseSerialNumberFile(fileContent);
        allEntries.push(...entries);
      }

      // Insert entries into the database
      await this.dvSerialService.saveEntriesToDatabase(allEntries);

      const outputFilePath = path.join(__dirname, 'output.csv');
      this.dvSerialService.exportToCSV(allEntries, outputFilePath);

      return res.json({
        message: 'Files parsed successfully',
        totalEntries: allEntries.length,
        data: allEntries,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error processing files',
        error: error.message,
      });
    }
  }

  @Get('search')
  async search(@Query('dv_plate_number') dvPlateNumber: string, @Query('serial_number') serialNumber: string, @Query('batch') batch: string, @Query('creation_date') createdAt: string, @Res() res: Response) {
    try {
      const result = await this.dvSerialService.search(dvPlateNumber, serialNumber, batch, createdAt);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Error during search', error: error.message });
    }
  }

  @Get('batch-search')
  async batchSearch(@Query('batch') batch: string, @Res() res: Response) {
    try {
      const result = await this.dvSerialService.batch_search(batch);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Error during batch search', error: error.message });
    }
  }

  @Get('filter')
  async filter(@Query('creation_date') creationDate: string, @Query('insertedAt') insertedAt: string, @Res() res: Response) {
    try {
      const results = await this.dvSerialService.filter({ creationDate, insertedAt });
      return res.json(results);
    } catch (error) {
      return res.status(500).json({ message: 'Error during filtering', error: error.message });
    }
  }

  @Get('get-counts')
  async getBatchCounts(@Res() res: Response) {
    try {
      const counts = await this.dvSerialService.getBatchCounts();
      return res.json(counts);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting batch counts', error: error.message });
    }
  }
}
