import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Indoor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    humidity: number;

    @Column()
    temperature: number;

    @Column()
    gasVal: number;

    @Column()
    location: string;

    @CreateDateColumn()
    timestamp: string;

}
