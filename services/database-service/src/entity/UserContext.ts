import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, ManyToOne } from "typeorm";
import { Allergy } from "./Allergy";

@Entity()
export class UserContext {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    //TODO: Encryption
    @Column()
    password: string;

    @OneToMany(() => Allergy, allergy => allergy.user)
    allergies: Allergy[];
}