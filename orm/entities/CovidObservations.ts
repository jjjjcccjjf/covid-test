import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CovidObservations {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    sno!: number

    @Column()
    observation_date!: Date

    @Column({
        type: "text",
        nullable: true
    })
    province_state!: string

    @Column({
        type: "text",
        nullable: true
    })
    country_region!: string

    @Column()
    last_update!: Date

    @Column()
    confirmed!: number

    @Column()
    deaths!: number

    @Column()
    recovered!: number
}