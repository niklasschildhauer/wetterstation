import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { Pollen } from "./Pollen";

@Entity()
export class UserContext {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    //TODO: Encryption
    @Column()
    password: string;

    // @ManyToMany(() => Allergy, allergy => allergy.users)
    // allergies: Allergy[];

    // @ManyToMany(() => Pollen, pollen => pollen.users)
    // pollen: Allergy[];
}