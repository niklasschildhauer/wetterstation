import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Outdoor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    humidity: number;

    @Column()
    temperature: number;

    @Column()
    pressure: number;

}
