import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from "typeorm";
import { Allergy } from "./Allergy";

@Entity()
export class Pollen {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pollenName: string;

    @OneToMany(() => Allergy, allergy => allergy.pollen)
    allergies: Allergy[];
}