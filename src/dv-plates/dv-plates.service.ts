import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { start } from 'repl';
import { PrismaService } from 'src/prisma/prisma.service';

interface DVSerialEntry {
  dv_plate_number: string;
  serial_number: string;
  creation_date: string;
  batch: string;
}

@Injectable()
export class DVSerialService {

  constructor(private readonly prisma: PrismaService) {}
  parseSerialNumberFile(fileContent: string): DVSerialEntry[] {
    const plateNumberMatch = fileContent.match(/DV (\d+)Y - (\d+)Y/);
    const startPlateNumber = plateNumberMatch ? parseInt(plateNumberMatch[1]) : 1;
    const endPlateNumber = plateNumberMatch ? parseInt(plateNumberMatch[2]) : 100;

    const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line);

    const entries: DVSerialEntry[] = [];
    const uniqueSerialNumbers = new Set<string>();
    let currentPlateNumber = startPlateNumber;

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
          dv_plate_number: `DV ${currentPlateNumber}Y`,
          serial_number: serialNumber,
          creation_date: creationDate,
          batch: `DV ${startPlateNumber} - ${endPlateNumber} Y` 
        });

        uniqueSerialNumbers.add(serialNumber);

        currentPlateNumber++;
        if (currentPlateNumber > endPlateNumber) {
          currentPlateNumber = startPlateNumber;
        }
        i++;
      }
    }
    return entries;
  }

  async search(dvPlateNumber?: string, serialNumber?: string, batch?: string, creationDate?: string, insertedAt?: string): Promise<any> {
    const batchCounts = await this.prisma.dvplates.groupBy({ 
      by: ['batch'], 
      _count: { batch: true } 
    });
  
    const batches = batchCounts.map(batchCount => ({
      batch: batchCount.batch,
      count: batchCount._count.batch,
    }));
  
    const dvplatesdata = await this.prisma.dvplates.findMany({
      where: {
        dv_plate_number: dvPlateNumber,
        serial_number: serialNumber,
        batch,
        creation_date: creationDate,
        insertedAt: insertedAt,
      },
    });
  
    return {
      batches,
      dvplatesdata,
    };
  }
  
  async batch_search(batch: string): Promise<any> {
    return this.prisma.dvplates.findMany({
      where: {
        batch,
      },
    });
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
    await this.prisma.dvplates.findMany({})
  }

  async getBatchCounts(): Promise<{ batch: string, count: number }[]> { 
    const batchCounts = await this.prisma.dvplates.groupBy({ 
        by: ['batch'], 
        _count: { batch: true, }, 
    }); 
    return batchCounts.map(batchCount => 
        (
         { 
            batch: batchCount.batch, count: batchCount._count.batch,
         }
        )
    ); 
  }

  exportToCSV(entries: DVSerialEntry[], outputPath: string) {
    const csvHeader = 'DV Plate Number,Serial Number,Creation Date\n';
    const csvContent = entries.map(entry =>
      `${entry.dv_plate_number},${entry.serial_number},${entry.creation_date}`,
    ).join('\n');

    fs.writeFileSync(outputPath, csvHeader + csvContent);
    console.log(`CSV exported to ${outputPath}`);
  }

  async readFileContent(file: Express.Multer.File): Promise<string> {
    return file.buffer.toString('utf-8');
  }
}
