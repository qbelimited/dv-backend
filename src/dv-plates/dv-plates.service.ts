import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

interface DVSerialEntry {
  dv_plate_number: string;
  serial_number: string;
  creation_date: string;
  batchId: string;
}

@Injectable()
export class DVSerialService {

  constructor(private readonly prisma: PrismaService) {}

  async parseSerialNumberFile(fileContent: string): Promise<DVSerialEntry[]> {
    const plateNumberMatch = fileContent.match(/DV (\d+)Y - (\d+)Y/);
    const startPlateNumber = plateNumberMatch ? parseInt(plateNumberMatch[1]) : 1;
    const endPlateNumber = plateNumberMatch ? parseInt(plateNumberMatch[2]) : 100;

    const batchName = `DV ${startPlateNumber} - ${endPlateNumber} Y`;

    const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line);

    const entries: DVSerialEntry[] = [];
    const uniqueSerialNumbers = new Set<string>();
    let currentPlateNumber = startPlateNumber;

    let totalDvPlates = endPlateNumber - startPlateNumber + 1;

    // Check if the batch already exists 
    let batch = await this.prisma.dvbatches.findUnique({ where: { batch_number: batchName } }); 
    // If batch doesn't exist, create it 
    if (!batch) { 
      batch = await this.prisma.dvbatches.create({
        data: {
          batch_number: batchName,
          requested_by: '',
          status: 'Processing',
          total_dvplates: totalDvPlates,
        },
      });
    }

    batch = await this.prisma.dvbatches.findUnique({ where: { batch_number: batchName } }); 

    for (let i = 0; i < lines.length; i++) {
      const dateMatch = lines[i].match(/(?:&\[|\()(\d{4}\/\d{2}\/\d{2} \d{1,2}:\d{1,2}(:\d{1,2})?)(?:\]|\))?/);

      if (dateMatch && i + 1 < lines.length) {
        const creationDate = dateMatch[1];
        const serialNumber = lines[i + 1];

        if (!/^[\w-]+$/.test(serialNumber)) continue;

        if (uniqueSerialNumbers.has(serialNumber)) {
          console.warn(`Duplicate serial number skipped: ${serialNumber}`);
          continue;
        }

        entries.push({
          dv_plate_number: `DV ${currentPlateNumber} Y`,
          serial_number: serialNumber,
          creation_date: creationDate,
          batchId: batch.id, 
        });

        uniqueSerialNumbers.add(serialNumber);

        currentPlateNumber++;
        if (currentPlateNumber > endPlateNumber) {
          currentPlateNumber = startPlateNumber;
        }
        i++;
      }
    }

    // Update the total_dvplates count in the batch 
    await this.prisma.dvbatches.update({ 
      where: { batch_number: batchName }, 
      data: { total_dvplates: entries.length } 
    });

    return entries;
  }

  async search(dvPlateNumber?: string, serialNumber?: string, batch?: string, creationDate?: string, insertedAt?: string): Promise<any> {
    const filters: any = {};
    if (dvPlateNumber) filters.dv_plate_number = dvPlateNumber;
    if (serialNumber) filters.serial_number = serialNumber;
    if (creationDate) filters.creation_date = creationDate;
    if (insertedAt) filters.insertedAt = new Date(insertedAt);
  
    console.log(batch);
    
    // Get batches from the Dvbatches table
    const batches = await this.prisma.dvbatches.findMany({
      select: {
        id: true,
        batch_number: true,
        total_dvplates: true, // Fetch the total dvplates associated with the batch
      },
    });
  
    // Filter the batch based on the batch argument
    const filteredBatchId = batches.filter(batchItem => batchItem.batch_number === batch)[0]?.id || '';
  
    // Construct the `where` clause, including `batchId` only if it is not empty or null
    const dvplatesWhereClause: any = {
      dv_plate_number: dvPlateNumber,
      serial_number: serialNumber,
      creation_date: creationDate,
      insertedAt: insertedAt,
    };
  
    // Only include `batchId` in the `where` clause if `filteredBatchId` is not empty or null
    if (filteredBatchId && filteredBatchId !== '') {
      dvplatesWhereClause.batchId = filteredBatchId;
    }
  
    // Now search for dvplates based on the `where` clause
    const dvplates = await this.prisma.dvplates.findMany({
      where: dvplatesWhereClause,
      select: {
        dv_plate_number: true,
        serial_number: true,
        creation_date: true,
        insertedAt: true,
        description: true,
      },
    });
  
    // Map over batches to count the related dvplates
    const batchCountResults = batches.map(batch => {
      return {
        batch: batch.batch_number,
        count: batch.total_dvplates
      };
    });
  
    return {
      batches: batchCountResults,
      dvplatesdata: dvplates,
    };
  }  
  
  
  async batch_search(batch: string): Promise<any> {
    // Query the Dvbatches table to get the batch with its related Dvplates
    const batchData = await this.prisma.dvbatches.findUnique({
      where: {
        batch_number: batch, // Find batch by batch_number
      },
      select: {
        id: true,
        batch_number: true,
        dvplates: { // Fetch related dvplates for the batch
          select: {
            dv_plate_number: true,
            serial_number: true,
            creation_date: true,
            insertedAt: true,
          },
        },
      },
    });
  
    // If batch does not exist, return a message or empty result
    if (!batchData) {
      return { message: "Batch not found", batch_number: batch };
    }
  
    // Return the batch data and related dvplates
    return {
      batch: batchData.batch_number,
      dvplates: batchData.dvplates,
    };
  }
  

  async filter(filters: { creationDate?: string; insertedAt?: string }): Promise<any[]> {
    return this.prisma.dvplates.findMany({
      where: {
        creation_date: filters.creationDate,
        insertedAt: filters.insertedAt ? new Date(filters.insertedAt) : undefined,
      },
    });
  }

  // Saves entries to the database
  async saveEntriesToDatabase(entries: any[]) {
    await this.prisma.dvplates.createMany({
      data: entries,
    });
  }

  async getAllData() {
    await this.prisma.dvplates.findMany({});
  }

  async readFileContent(file: Express.Multer.File): Promise<string> {
    return file.buffer.toString('utf-8');
  }

  // Methods to handle manufacturers 
  async createManufacturer(name: string, address?: string ) { 
    return this.prisma.manufacturers.create({ 
      data: { 
        manufacturer_name: name, 
        address: address || '', 
      }, 
    }); 
  }

  async createContactPerson(name: string, email: string, phone_number: string, manufacturer_id: string) {
    return this.prisma.contactPerson.create({
      data: {
        contact_person_name: name,
        email,
        phone_number,
        manufacturerId: manufacturer_id,
      },
    });
  }

  async getManufacturers() {
    return this.prisma.manufacturers.findMany({
      include: {
        contactPersons: true,
      },
    });
  }

  async getManufacturerById(id: string) { 
    return this.prisma.manufacturers.findUnique({ where: { id }, }); 
  }

  // Methods to handle batches
  async createBatch(batch_number: string, requested_by: string, status: string, total_dvplates: number, manufacturer_id: string) { 
    return this.prisma.dvbatches.create({ 
      data: { 
        batch_number, 
        requested_by, 
        status, 
        total_dvplates, 
        manufacturerId: manufacturer_id // This will set the manufacturer ID
      }, 
    }); 
  } 
  
  async getBatches() { 
    return this.prisma.dvbatches.findMany(); 
  } 
  
  async getBatchById(id: string) { 
    return this.prisma.dvbatches.findUnique({ where: { id }, }); 
  }

  async updatePlate(id: string, description: string, ) {
    return this.prisma.dvplates.update({
      where: { id },
      data: {
        description
      },
    });
  }

  async updateBatch(id: string, batch_number: string, requested_by: string, status: string, total_dvplates: number) { 
    return this.prisma.dvbatches.update({ 
      where: { id }, 
      data: { 
        batch_number, 
        requested_by, 
        status, 
        total_dvplates, 
      }, 
    }); 
  } 
  
  async deleteBatch(id: string) { 
    return this.prisma.dvbatches.delete({ where: { id }, }); 
  }

  async deleteManufacturer(id: string) {
    return this.prisma.manufacturers.delete({ where: { id } });
  }

  async updateManufacturer(id: string, name: string, address: string) {
    return this.prisma.manufacturers.update({
      where: { id },
      data: {
        manufacturer_name: name,
        address: address,
      },
    });
  }

  async searchManufacturer(name: string) {
    return this.prisma.manufacturers.findMany({
      where: {
        manufacturer_name: {
          contains: name,
        },
      },
    });
  }

  
}
