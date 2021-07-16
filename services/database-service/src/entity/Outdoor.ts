import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";


@Entity()
export class Outdoor {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  humidity: number;

  @Column()
  temperature: number;

  @Column()
  pressure: number;

  @Column()
  location: string;

  @Column()
  timestamp: string;
  
  @Column()
  deviceID: number;
}
