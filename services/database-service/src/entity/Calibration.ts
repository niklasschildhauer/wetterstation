import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Calibration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  deviceID: number
}