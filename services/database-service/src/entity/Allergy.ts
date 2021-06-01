import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Pollen } from "./Pollen";
import { UserContext } from './UserContext';

@Entity()
export class Allergy {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserContext, user => user.allergies)
    user: UserContext;

    @ManyToOne(() => Pollen, pollen => pollen.allergies)
    pollen: Pollen;
}