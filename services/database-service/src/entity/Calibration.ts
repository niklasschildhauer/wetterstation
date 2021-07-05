import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserContext } from "./UserContext";

@Entity()
export class Calibration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @ManyToOne(() => UserContext, user => user.calibration)
  user: UserContext;
}