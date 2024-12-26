import { Controller, Post, UploadedFiles, UseInterceptors, Res, Get, Query, Put, Body, Delete } from '@nestjs/common';
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
        const entries = await this.dvSerialService.parseSerialNumberFile(fileContent); // Await the promise
        allEntries.push(...entries);
      }      

      // Insert entries into the database
      await this.dvSerialService.saveEntriesToDatabase(allEntries);

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

  @Get('batches')
  async getBatches(@Res() res: Response) {
    try {
      const batches = await this.dvSerialService.getBatches();
      return res.json(batches);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting batches', error: error.message });
    }
  }

  @Get('batch-by-id')
  async getBatchById(@Query('id') id: string, @Res() res: Response) {
    try {
      const batch = await this.dvSerialService.getBatchById(id);
      return res.json(batch);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting batch by id', error: error.message });
    }
  }
  
  @Put('batch-update')
  async updateBatch(@Body() body: { id: string, batch_number: string, requested_by: string, status: string, total_dvplates: number }, @Res() res: Response) {
    try {
      const { id, batch_number, requested_by, status, total_dvplates } = body;
      await this.dvSerialService.updateBatch(id, batch_number, requested_by, status, total_dvplates);
      return res.json({ message: 'Batch updated successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating batch', error: error.message });
    }
  }

  @Post('batch-create')
  async createBatch(@Body() body: { batch_number: string, requested_by: string, status: string, total_dvplates: number, manufacturer_id: string }, @Res() res: Response) {
    try {
      const { batch_number, requested_by, status, total_dvplates, manufacturer_id } = body;
      await this.dvSerialService.createBatch(batch_number, requested_by, status, total_dvplates, manufacturer_id);
      return res.json({ message: 'Batch created successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error creating batch', error: error.message });
    }
  }

  @Get('manufacturers')
  async getManufacturers(@Res() res: Response) {
    try {
      const manufacturers = await this.dvSerialService.getManufacturers();
      return res.json(manufacturers);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting manufacturers', error: error.message });
    }
  }

  @Get('manufacturer-by-id')
  async getManufacturerById(@Query('id') id: string, @Res() res: Response) {
    try {
      const manufacturer = await this.dvSerialService.getManufacturerById(id);
      return res.json(manufacturer);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting manufacturer by id', error: error.message });
    }
  }

  @Post('manufacturer-create')
  async createManufacturer(@Body() body: { name: string, address?: string }, @Res() res: Response) {
    try {
      const { name, address } = body;
      await this.dvSerialService.createManufacturer(name, address);
      return res.json({ message: 'Manufacturer created successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error creating manufacturer', error: error.message });
    }
  }

  @Get('manufacturer-search')
  async searchManufacturer(@Query('name') name: string, @Res() res: Response) {
    try {
      const result = await this.dvSerialService.searchManufacturer(name);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Error searching manufacturer', error: error.message });
    }
  }

  @Delete('manufacturer')
  async deleteManufacturer(@Query('id') id: string, @Res() res: Response) {
    try {
      await this.dvSerialService.deleteManufacturer(id);
      return res.json({ message: 'Manufacturer deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting manufacturer', error: error.message });
    }
  }

}
