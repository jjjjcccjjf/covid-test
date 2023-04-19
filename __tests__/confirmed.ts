import asynchandler from '../pages/api/top/confirmed';
import { prismaMock } from '../singleton'
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRequest, createResponse, createMocks, RequestMethod } from 'node-mocks-http';

export type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
export type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

describe('GET /api/top/confirmed', () => {

    it('should return a successful response', async () => {
        const req = createRequest<ApiRequest>()
        const res = createResponse<ApiResponse>()
        req.query = { observation_date: "2020-01-22", max_results: "3" };

        const mockResult = {
            "observation_date": "2020-01-22",
            "countries": [
                {
                    "country": "Mainland China",
                    "confirmed": 547,
                    "deaths": 17,
                    "recovered": 28
                },
                {
                    "country": "Japan",
                    "confirmed": 2,
                    "deaths": 0,
                    "recovered": 0
                },
                {
                    "country": "Thailand",
                    "confirmed": 2,
                    "deaths": 0,
                    "recovered": 0
                }
            ]
        }

        const queryResult = prismaMock.covid_observations.groupBy as jest.Mock
        queryResult.mockResolvedValue(mockResult)

        await asynchandler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(mockResult);

    })

    it('should succeed even if, provided a correctly formatted date, no results were found', async () => {
        const req = createRequest<ApiRequest>()
        const res = createResponse<ApiResponse>()
        req.query = { observation_date: "2077-01-22", max_results: "3" };

        const mockResult = {
            "observation_date": "2077-01-22",
            "countries": []
        }

        const queryResult = prismaMock.covid_observations.groupBy as jest.Mock
        queryResult.mockResolvedValue(mockResult)

        await asynchandler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(mockResult);
    })


    it('should catch malformed request query', async () => {
        const req = createRequest<ApiRequest>()
        const res = createResponse<ApiResponse>()

        req.query.observation_date = 'asdasd'
        req.query.max_results = 'qlwehkjh'

        await asynchandler(req, res)

        expect(res.statusCode).toBe(400)
        expect(res._getJSONData()).toMatchObject({
            errors: expect.any(String)
        })
    })

    it('should catch empty request query', async () => {
        const req = createRequest<ApiRequest>()
        const res = createResponse<ApiResponse>()

        await asynchandler(req, res)

        expect(res.statusCode).toBe(400)
        expect(res._getJSONData()).toMatchObject({
            errors: expect.any(String)
        })
    })


})