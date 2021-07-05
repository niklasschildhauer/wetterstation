import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { EncryptionTransformer } from "typeorm-encrypted";
import { Calibration } from "./Calibration";
import { Pollen } from "./Pollen";

@Entity()
export class UserContext {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({
    type: "varchar",
    nullable: false,
    transformer: new EncryptionTransformer({
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'ff5ac19190424b1d88f9419ef949ae56'
    })
  })
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

  @OneToMany(() => Calibration, calibration => calibration.user)
  calibration: Calibration[];

  /*
  * Our own tests in our environments determined 25% gasValue as a reference value, hence this will be the default
  */
  @Column(
    { default: 25 }
  )
  userCalibratedGasVal: number;

  @ManyToMany(() => Pollen, pollen => pollen.id)
  pollen: Pollen[];
}