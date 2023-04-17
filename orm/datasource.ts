import { DataSource } from "typeorm"
import { CovidObservations } from "./entities/CovidObservations"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [CovidObservations],
    subscribers: [],
    migrations: [],
})