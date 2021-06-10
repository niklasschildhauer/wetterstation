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

    @Column()
    theme: string;

    @Column()
    fontSize: number;

    @Column()
    selfVoicingEnabled: boolean;

    @Column()
    doVentilationReminder: boolean;

    @Column()
    reduceMotion: boolean;

    @ManyToMany(() => Pollen, pollen => pollen.id)
    pollen: Pollen[];
}