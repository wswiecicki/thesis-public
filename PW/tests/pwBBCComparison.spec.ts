import { test, expect } from '@playwright/test';
const forecastUrl = 'https://api.pirateweather.net/';
test.fail('Various elevations have different temperatures', async ({ request }) => {
    const zakopaneLatitude = '49.299030';
    const zakopaneLongitute = '19.949047';

    const pwResponse = await request.get(
        `${forecastUrl}forecast/${process.env.PW_TOKEN}/${zakopaneLatitude},${zakopaneLongitute}?units=si`
    );

    const pwResponseBody = await pwResponse.json();
    const zakopanePwTemperature = pwResponseBody.hourly.data[1].temperature;

    const bbcResponse = await request.get('https://weather-broker-cdn.api.bbci.co.uk/en/forecast/aggregated/3080866');
    const bbcResponseBody = await bbcResponse.json();

    const zakopaneBbcTemperature = bbcResponseBody.forecasts[0].detailed.reports[0].temperatureC;
    const temperatureDifference = Math.abs(parseFloat(zakopanePwTemperature) - parseFloat(zakopaneBbcTemperature));

    expect(temperatureDifference).toBeLessThan(1);
});

//3080866
