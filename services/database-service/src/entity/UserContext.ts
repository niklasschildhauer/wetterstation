import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
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
}