import fs from "fs";
import path from "path";
import { parse } from 'csv-parse'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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

async function main() {

    try {
        const output = await parseFromCsvFile()

        if (output.length <= 0) {
            console.log({ error: 'failed parsing the csv' })
        }

        const chunkSize = 5000;
        const numChunks = Math.ceil(output.length / chunkSize);
        for (let i = 0; i < numChunks; i++) {
            const startIndex = i * chunkSize;
            const endIndex = Math.min(startIndex + chunkSize, output.length);
            const chunk = output.slice(startIndex, endIndex);
            const users = await prisma.covid_observations.createMany({
                data: chunk,
            })
        }

        console.log({ success: true })

    } catch (error) {
        console.log(error)
    }
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })