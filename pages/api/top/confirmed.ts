import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from '@prisma/client'
import { ResponseError, ObservationData, CountryData } from "@/interfaces"

const prisma = new PrismaClient({
    errorFormat: 'minimal',
})

export default async function asynchandler(req: NextApiRequest, res: NextApiResponse<ObservationData | ResponseError>) {

    if (req.method !== 'GET') {
        return res.status(405).json({ errors: `${req.method} method not allowed` })
    }

    try {

        // Get our query strings
        const limit = Number(req.query.max_results)
        const dateString = String(req.query.observation_date)

        // This is our query to the covid_observations table
        const result = await prisma.covid_observations.groupBy({
            by: ["country_region"],
            where: {
                observation_date: {
                    equals: new Date(dateString)
                }
            },
            _sum: {
                confirmed: true,
                deaths: true,
                recovered: true
            },
            orderBy: {
                _sum: {
                    confirmed: 'desc'
                }
            },
            take: limit
        });

        // We format the result of the query so it matches the desired shape of our response
        const filteredResult = result.map((item) => {
            const countryData: CountryData = {
                country: String(item.country_region), confirmed: Number(item._sum.confirmed), deaths: Number(item._sum.deaths), recovered: Number(item._sum.recovered)
            }
            return countryData
        })

        res.status(200).json({ observation_date: dateString, countries: filteredResult })
    } catch (error: any) {
        // console.log(error)
        res.status(400).json({ errors: error.message })
    } finally {
        await prisma.$disconnect()
    }

}