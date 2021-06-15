import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { UserContext } from "./UserContext";

@Entity()
export class Pollen {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pollenName: string;

    // @ManyToMany(() => Allergy, allergy => allergy.pollen)
    // allergies: Allergy[];

    @ManyToMany(() => UserContext, userContext => userContext.id)
    @JoinTable()
    users: UserContext[];
}