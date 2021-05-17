import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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

    @CreateDateColumn()
    timestamp: Date;

    @Column()
    apparentTemperature: number;

}
