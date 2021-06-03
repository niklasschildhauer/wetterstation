import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Allergy } from "./Allergy";

@Entity()
export class Pollen {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pollenName: string;
}