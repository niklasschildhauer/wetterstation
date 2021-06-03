import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Pollen } from "./Pollen";
import { UserContext } from './UserContext';

@Entity()
export class Allergy {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => UserContext)
    @JoinTable()
    users: UserContext[];

    @ManyToMany(() => Pollen)
    @JoinTable()
    pollen: Pollen[];
}