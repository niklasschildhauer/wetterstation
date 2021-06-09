import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Forecast {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    trend: string;

    @Column()
    weatherIcon: string;

    @Column()
    weatherDescription: string;

    @Column()
    seaPressure: number;

    @CreateDateColumn()
    timestamp: string;

}