import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DVPlate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dvPlateNumber: string;

  @Column()
  serialNumber: string;

  @Column()
  creationDate: string;
}
