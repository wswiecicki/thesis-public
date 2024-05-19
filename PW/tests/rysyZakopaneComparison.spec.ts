import { test, expect } from '@playwright/test';
const forecastUrl = 'https://api.pirateweather.net/';
test.fail('Various elevations have different temperatures', async ({ request }) => {
    const rysyLatitude = '49.17944';
    const rysyLongitude = '20.08806';
    const zakopaneLatitude = '49.299030';
    const zakopaneLongitute = '19.949047';

    const rysyResponse = await request.get(
        `${forecastUrl}forecast/${process.env.PW_TOKEN}/${rysyLatitude},${rysyLongitude}?units=si`
    );
    const zakopaneResponse = await request.get(
        `${forecastUrl}forecast/${process.env.PW_TOKEN}/${zakopaneLatitude},${zakopaneLongitute}?units=si`
    );

    const rysyResponseBody = await rysyResponse.json();
    const zakopaneResponseBody = await zakopaneResponse.json();
    expect(rysyResponseBody.elevation).not.toEqual(zakopaneResponseBody.elevation);
    expect(rysyResponseBody.currently.temperature).not.toEqual(zakopaneResponseBody.currently.temperature);
});

//3080866
