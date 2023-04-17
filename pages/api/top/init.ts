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
        // const csvData = `SNo,ObservationDate,Province/State,Country/Region,Last Update,Confirmed,Deaths,Recovered
        // 1,01/22/2020,Anhui,Mainland China,1/22/2020 17:00,1.0,0.0,0.0
        // 2,01/22/2020,Beijing,Mainland China,1/22/2020 17:00,14.0,0.0,0.0
        // 3,01/22/2020,Chongqing,Mainland China,1/22/2020 17:00,6.0,0.0,0.0
        // 4,01/22/2020,Fujian,Mainland China,1/22/2020 17:00,1.0,0.0,0.0
        // 5,01/22/2020,Gansu,Mainland China,1/22/2020 17:00,0.0,0.0,0.0
        // 6,01/22/2020,Guangdong,Mainland China,1/22/2020 17:00,26.0,0.0,0.0
        // 7,01/22/2020,Guangxi,Mainland China,1/22/2020 17:00,2.0,0.0,0.0
        // 8,01/22/2020,Guizhou,Mainland China,1/22/2020 17:00,1.0,0.0,0.0
        // 9,01/22/2020,Hainan,Mainland China,1/22/2020 17:00,4.0,0.0,0.0
        // 10,01/22/2020,Hebei,Mainland China,1/22/2020 17:00,1.0,0.0,0.0
        // 11,01/22/2020,Heilongjiang,Mainland China,1/22/2020 17:00,0.0,0.0,0.0
        // 12,01/22/2020,Henan,Mainland China,1/22/2020 17:00,5.0,0.0,0.0
        // 13,01/22/2020,Hong Kong,Hong Kong,1/22/2020 17:00,0.0,0.0,0.0
        // 14,01/22/2020,Hubei,Mainland China,1/22/2020 17:00,444.0,17.0,28.0
        // 15,01/22/2020,Hunan,Mainland China,1/22/2020 17:00,4.0,0.0,0.0
        // 16,01/22/2020,Inner Mongolia,Mainland China,1/22/2020 17:00,0.0,0.0,0.0
        // 17,01/22/2020,Jiangsu,Mainland China,1/22/2020 17:00,1.0,0.0,0.0
        // 18,01/22/2020,Jiangxi,Mainland China,1/22/2020 17:00,2.0,0.0,0.0
        // 19,01/22/2020,Jilin,Mainland China,1/22/2020 17:00,0.0,0.0,0.0
        // 20,01/22/2020,Liaoning,Mainland China,1/22/2020 17:00,2.0,0.0,0.0
        // 21,01/22/2020,Macau,Macau,1/22/2020 17:00,1.0,0.0,0.0
        // 22,01/22/2020,Ningxia,Mainland China,1/22/2020 17:00,1.0,0.0,0.0
        // 23,01/22/2020,Qinghai,Mainland China,1/22/2020 17:00,0.0,0.0,0.0
        // 24,01/22/2020,Shaanxi,Mainland China,1/22/2020 17:00,0.0,0.0,0.0
        // 25,01/22/2020,Shandong,Mainland China,1/22/2020 17:00,2.0,0.0,0.0
        // 26,01/22/2020,Shanghai,Mainland China,1/22/2020 17:00,9.0,0.0,0.0
        // 27,01/22/2020,Shanxi,Mainland China,1/22/2020 17:00,1.0,0.0,0.0
        // 28,01/22/2020,Sichuan,Mainland China,1/22/2020 17:00,5.0,0.0,0.0
        // 29,01/22/2020,Taiwan,Taiwan,1/22/2020 17:00,1.0,0.0,0.0
        // 30,01/22/2020,Tianjin,Mainland China,1/22/2020 17:00,4.0,0.0,0.0
        // 31,01/22/2020,Tibet,Mainland China,1/22/2020 17:00,0.0,0.0,0.0
        // 32,01/22/2020,Washington,US,1/22/2020 17:00,1.0,0.0,0.0
        // 33,01/22/2020,Xinjiang,Mainland China,1/22/2020 17:00,0.0,0.0,0.0
        // 34,01/22/2020,Yunnan,Mainland China,1/22/2020 17:00,1.0,0.0,0.0
        // 35,01/22/2020,Zhejiang,Mainland China,1/22/2020 17:00,10.0,0.0,0.0
        // 36,01/22/2020,,Japan,1/22/2020 17:00,2.0,0.0,0.0
        // 37,01/22/2020,,Thailand,1/22/2020 17:00,2.0,0.0,0.0
        // 38,01/22/2020,,South Korea,1/22/2020 17:00,1.0,0.0,0.0
        // 39,01/23/2020,Anhui,Mainland China,1/23/20 17:00,9.0,0.0,0.0
        // 40,01/23/2020,Beijing,Mainland China,1/23/20 17:00,22.0,0.0,0.0
        // 41,01/23/2020,Chongqing,Mainland China,1/23/20 17:00,9.0,0.0,0.0
        // 42,01/23/2020,Fujian,Mainland China,1/23/20 17:00,5.0,0.0,0.0
        // 43,01/23/2020,Gansu,Mainland China,1/23/20 17:00,2.0,0.0,0.0
        // 44,01/23/2020,Guangdong,Mainland China,1/23/20 17:00,32.0,0.0,2.0
        // 45,01/23/2020,Guangxi,Mainland China,1/23/20 17:00,5.0,0.0,0.0
        // 46,01/23/2020,Guizhou,Mainland China,1/23/20 17:00,3.0,0.0,0.0
        // 47,01/23/2020,Hainan,Mainland China,1/23/20 17:00,5.0,0.0,0.0
        // 48,01/23/2020,Hebei,Mainland China,1/23/20 17:00,1.0,1.0,0.0
        // 49,01/23/2020,Heilongjiang,Mainland China,1/23/20 17:00,2.0,0.0,0.0
        // 50,01/23/2020,Henan,Mainland China,1/23/20 17:00,5.0,0.0,0.0
        // 51,01/23/2020,Hong Kong,Hong Kong,1/23/20 17:00,2.0,0.0,0.0
        // 52,01/23/2020,Hubei,Mainland China,1/23/20 17:00,444.0,17.0,28.0
        // 53,01/23/2020,Hunan,Mainland China,1/23/20 17:00,9.0,0.0,0.0
        // 54,01/23/2020,Inner Mongolia,Mainland China,1/23/20 17:00,0.0,0.0,0.0
        // 55,01/23/2020,Jiangsu,Mainland China,1/23/20 17:00,5.0,0.0,0.0
        // 56,01/23/2020,Jiangxi,Mainland China,1/23/20 17:00,7.0,0.0,0.0
        // 57,01/23/2020,Jilin,Mainland China,1/23/20 17:00,1.0,0.0,0.0
        // 58,01/23/2020,Liaoning,Mainland China,1/23/20 17:00,3.0,0.0,0.0
        // 59,01/23/2020,Macau,Macau,1/23/20 17:00,2.0,0.0,0.0
        // 60,01/23/2020,Ningxia,Mainland China,1/23/20 17:00,1.0,0.0,0.0
        // 61,01/23/2020,Qinghai,Mainland China,1/23/20 17:00,0.0,0.0,0.0
        // 62,01/23/2020,Shaanxi,Mainland China,1/23/20 17:00,3.0,0.0,0.0
        // 63,01/23/2020,Shandong,Mainland China,1/23/20 17:00,6.0,0.0,0.0
        // 64,01/23/2020,Shanghai,Mainland China,1/23/20 17:00,16.0,0.0,0.0
        // 65,01/23/2020,Shanxi,Mainland China,1/23/20 17:00,1.0,0.0,0.0
        // 66,01/23/2020,Sichuan,Mainland China,1/23/20 17:00,8.0,0.0,0.0
        // 67,01/23/2020,Taiwan,Taiwan,1/23/20 17:00,1.0,0.0,0.0
        // 68,01/23/2020,Tianjin,Mainland China,1/23/20 17:00,4.0,0.0,0.0
        // 69,01/23/2020,Tibet,Mainland China,1/23/20 17:00,0.0,0.0,0.0
        // 70,01/23/2020,Washington,US,1/23/20 17:00,1.0,0.0,0.0
        // 71,01/23/2020,Xinjiang,Mainland China,1/23/20 17:00,2.0,0.0,0.0
        // 72,01/23/2020,Yunnan,Mainland China,1/23/20 17:00,2.0,0.0,0.0
        // 73,01/23/2020,Zhejiang,Mainland China,1/23/20 17:00,27.0,0.0,0.0
        // 74,01/23/2020,,Japan,1/23/20 17:00,1.0,0.0,0.0
        // 75,01/23/2020,,Thailand,1/23/20 17:00,3.0,0.0,0.0
        // 76,01/23/2020,,South Korea,1/23/20 17:00,1.0,0.0,0.0
        // 77,01/23/2020,,Singapore,1/23/20 17:00,1.0,0.0,0.0
        // 78,01/23/2020,,Philippines,1/23/20 17:00,0.0,0.0,0.0
        // 79,01/23/2020,,Malaysia,1/23/20 17:00,0.0,0.0,0.0
        // 80,01/23/2020,,Vietnam,1/23/20 17:00,2.0,0.0,0.0
        // 81,01/23/2020,,Australia,1/23/20 17:00,0.0,0.0,0.0
        // 82,01/23/2020,,Mexico,1/23/20 17:00,0.0,0.0,0.0
        // 83,01/23/2020,,Brazil,1/23/20 17:00,0.0,0.0,0.0
        // 84,01/23/2020,,Colombia,1/23/20 17:00,0.0,0.0,0.0
        // 85,01/24/2020,Hubei,Mainland China,1/24/20 17:00,549.0,24.0,31.0
        // 86,01/24/2020,Guangdong,Mainland China,1/24/20 17:00,53.0,0.0,2.0
        // 87,01/24/2020,Zhejiang,Mainland China,1/24/20 17:00,43.0,0.0,1.0
        // 88,01/24/2020,Beijing,Mainland China,1/24/20 17:00,36.0,0.0,1.0
        // 89,01/24/2020,Chongqing,Mainland China,1/24/20 17:00,27.0,0.0,0.0
        // 90,01/24/2020,Hunan,Mainland China,1/24/20 17:00,24.0,0.0,0.0
        // 91,01/24/2020,Guangxi,Mainland China,1/24/20 17:00,23.0,0.0,0.0
        // 92,01/24/2020,Shanghai,Mainland China,1/24/20 17:00,20.0,0.0,1.0
        // 93,01/24/2020,Jiangxi,Mainland China,1/24/20 17:00,18.0,0.0,0.0
        // 94,01/24/2020,Sichuan,Mainland China,1/24/20 17:00,15.0,0.0,0.0
        // 95,01/24/2020,Shandong,Mainland China,1/24/20 17:00,15.0,0.0,0.0
        // 96,01/24/2020,Anhui,Mainland China,1/24/20 17:00,15.0,0.0,0.0
        // 97,01/24/2020,Fujian,Mainland China,1/24/20 17:00,10.0,0.0,0.0
        // 98,01/24/2020,Henan,Mainland China,1/24/20 17:00,9.0,0.0,0.0
        // 99,01/24/2020,Jiangsu,Mainland China,1/24/20 17:00,9.0,0.0,0.0`
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

        // const chunkSize = 5000;
        // const chunks = [];
        // const numChunks = Math.ceil(output.length / chunkSize);
        
        // for (let i = 0; i < numChunks; i++) {
        //   const start = i * chunkSize;
        //   const end = start + chunkSize;
        //   chunks.push(output.slice(start, end));
        // }
        
        // const promises = chunks.map(chunk => {
        //   return AppDataSource.createQueryBuilder()
        //     .insert()
        //     .into(CovidObservations)
        //     .values(chunk)
        //     .execute();
        // });
        
        // await Promise.all(promises);


        res.status(200).json({ success: true })

    } catch (error) {
        res.status(400).json({ error: error })
        console.log(error)
    }


}








