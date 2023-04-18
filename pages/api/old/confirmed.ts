import type { NextApiRequest, NextApiResponse } from "next"
import { AppDataSource } from "@/orm/datasource"
import { CovidObservations } from "@/orm/entities/CovidObservations";

export default async function asynchandler(req: NextApiRequest, res: NextApiResponse<any>) {

    const limit = Number(req.query.max_results)
    const dateString = req.query.observation_date

    await AppDataSource.initialize()
        .then(() => {
            console.log('DB initialized successfully')
        })
        .catch((error: any) => {
            console.log(error)
        })

    try {
        const result = await AppDataSource
            .getRepository(CovidObservations)
            .createQueryBuilder("covid")
            .select("covid.country_region as country")
            .addSelect("SUM(covid.confirmed) as confirmed")
            .addSelect("SUM(covid.deaths) as deaths")
            .addSelect("SUM(covid.recovered) as recovered")
            .where("DATE(covid.observation_date) = :date", { date: dateString })
            .groupBy("covid.country_region")
            .orderBy("confirmed", "DESC")
            .limit(limit)
            .getRawMany()

        res.status(200).json({
            observation_date: dateString,
            countries: result
        })
    } catch (err: any) {
        res.status(400).json({ errors: err.message })
    }

}