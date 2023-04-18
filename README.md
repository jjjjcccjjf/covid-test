## Table of Contents
* [Project Requirements](#project-requirements)
* [Getting Started](#getting-started)
  * [Testing Live](#1-testing-live)
  * [Running on your development machine](#2-running-on-your-development-machine)
* [Application URL](#application-url)
* [Endpoints](#endpoints)
  * [Get top confirmed cases by observation date](#get-top-confirmed-cases-by-observation-date)

## Project Requirements
- [ ] Download the COVID-19 data set (covid_19_data.csv). 
- [ ] On startup of the web application, parse the CSV file and store the relevant data in a table named covid_observations.
- [ ] Create an endpoint GET /top/confirmed that returns a list of the top N countries with confirmed cases for a given observation date where N is the maximum number of results. Include the total number of deaths and recoveries per country in the response for that day.
- [ ] Include a README file with instructions on how to run the application.

## Getting Started

There are two ways to run this application. 

## 1.) Testing Live

I have uploaded this project to the following URL for convenience: 

`https://covid-test-vert.vercel.app/api`

And you can immediately test the API.

## 2.) Running on your development machine

### Step 1
```bash
# install dependencies
npm install

# seed the database
npx prisma db seed
```

**NOTE**: On production builds, the seeding process is automatically executed upon application bootstrap. (See `package.json -> scripts -> postbuild`). But the script won't run on dev environment so we have to manually seed the DB.

### Step 2
Populate environment variables (See `.env.example`), and save it to `.env` file on the root directory.

```env
DATABASE_URL=postgresql://example:example@localhost:5432/example
```
### Step 3
```bash
# run development server
npm run dev
```
You can now test the API.

## Application URL

Base URL for live: `https://covid-test-vert.vercel.app/api`

Base URL for development: `http://localhost:3000/api`

## Endpoints
### Get top confirmed cases by observation date
Method: `GET`  
Endpoint: `/top/confirmed`  

#### Request Payload
| key | data type | example value | request type |
| --- | ----- | --------- | ------------ |
| observation_date | `string` | `2020-01-22` | `query string`|
| max_results | `string` | `10` | `query string`|

#### Example Usage

`\GET https://covid-test-vert.vercel.app/api/top/confirmed?observation_date=2020-01-22&max_results=10`

#### Example Response
```json
200 OK
{
   "observation_date":"2020-01-22",
   "countries":[
      {
         "country":"Mainland China",
         "confirmed":547,
         "deaths":17,
         "recovered":28
      },
      {
         "country":"Japan",
         "confirmed":2,
         "deaths":0,
         "recovered":0
      },
      // the rest of the results
   ]
}
```