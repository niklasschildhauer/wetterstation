import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Indoor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    humidity: number;

    @Column()
    temperature: number;

    @Column()
    pressure: number;

    @Column()
    gasVal: number;

    @Column()
    location: string;

   // @CreateDateColumn()
   // timestamp: Date;

}
