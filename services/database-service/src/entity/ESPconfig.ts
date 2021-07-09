import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ESPConfig {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roomName: string;

    @Column()
    transmissionFrequency: number; // in minutes -> 1min - 10min

    @Column()
    postalCode: string; // postalCode for determination of altitude (needed for weather forecast / analysis)

    @Column({
        default:25
    })
    gasValCalibrationValue: number;
}