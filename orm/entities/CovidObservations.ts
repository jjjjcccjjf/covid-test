import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CovidObservations {
    @PrimaryGeneratedColumn()
    id!: number

    @Column("text")
    sno!: string
    
    @Column()
    observation_date!: Date

    @Column("text")
    province_state!: string

    @Column("text")
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