import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";


@Entity()
export class Outdoor {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    humidity: number;

    @Column()
    temperature: number;

    @Column()
    pressure: number;

    @Column()
    location: string;

  //  @CreateDateColumn()
   // timestamp: Date;

   	@CreateDateColumn({ type: 'timestamp', name: 'create_date', default: () => 'LOCALTIMESTAMP' })
  	createDate: string;

    @Column()
    apparentTemperature: number;

}
