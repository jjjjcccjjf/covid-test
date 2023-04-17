import fs from "fs";
import path from "path";
import { parse } from 'csv-parse'
import type { NextApiRequest, NextApiResponse } from "next"
import { AppDataSource } from "@/orm/datasource"
import { CovidObservations } from "@/orm/entities/CovidObservations";


async function parseFromCsvFile(): Promise<any[]> {

    try {
        const csvFilePath = path.join(process.cwd(), 'public', 'covid_19_data.csv');
        const csvData = await fs.promises.readFile(csvFilePath, 'utf-8');
        const output = await new Promise<any[]>((resolve, reject) => {
            parse(csvData, {
                columns: ['sno', 'observation_date', 'province_state', 'country_region', 'last_update', 'confirmed', 'deaths', 'recovered'],
                cast: true,
                cast_date: true,
                skip_empty_lines: true,
                from: 2,
            }, (err, output) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(output);
                }
            });
        });
        return output;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export default async function asynchandler(req: NextApiRequest, res: NextApiResponse<any>) {

    await AppDataSource.initialize()
        .then(() => {
            console.log('DB initialized successfully')
        })
        .catch((error) => {
            console.log(error)
        })

    try {
        const output = await parseFromCsvFile()

        if (output.length <= 0) {
            res.status(400).json({ error: 'failed parsing the csv' })
        }

        const chunkSize = 5000;
        const numChunks = Math.ceil(output.length / chunkSize);
        for (let i = 0; i < numChunks; i++) {
            const startIndex = i * chunkSize;
            const endIndex = Math.min(startIndex + chunkSize, output.length);
            const chunk = output.slice(startIndex, endIndex);
            await AppDataSource
                .createQueryBuilder()
                .insert()
                .into(CovidObservations)
                .values(chunk)
                .execute();
        }
 
        res.status(200).json({ success: true })

    } catch (error) {
        res.status(400).json({ error: error })
        console.log(error)
    }


}








