import { DataSource } from "typeorm"
import { CovidObservations } from "./entities/CovidObservations"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: 5432,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DB,
    synchronize: true,
    logging: true,
    entities: [CovidObservations],
    subscribers: [],
    migrations: [],
})