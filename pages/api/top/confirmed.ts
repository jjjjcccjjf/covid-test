import fs from 'fs';
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next"
import { AppDataSource } from "@/orm/datasource"
import { parse } from 'csv-parse'

export default async function asynchandler(req: NextApiRequest, res: NextApiResponse<any>) {

    // AppDataSource.initialize()
    // .then(() => {
        // res.status(200).json({message: process.env.HOST})
        // res.status(200).json({message: "DB initialized"})
    // })
    // .catch((error) => console.log(error))


    const csvFilePath = path.join(process.cwd(), 'public', 'covid_19_data.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf-8');

    parse(csvData, {
        columns: ['sno', 'observation_date', 'province_state', 'country_region', 'last_update', 'confirmed', 'deaths', 'recovered'],
        cast: true,
        cast_date: true,
        skip_empty_lines: true,
        from: 2,
    }, (err, output) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json(output);
        }
    });

}