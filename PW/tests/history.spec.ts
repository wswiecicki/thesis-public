import { test, expect } from '@playwright/test';
const timeMachineUrl = 'https://timemachine.pirateweather.net/';
test.fail('History is available', async ({ request }) => {
    const requiredDate = new Date(2024, 5, 5);
    const latitude = '19.432608';
    const longitude = '-99.133209';

    const timestamp = Math.round(requiredDate.getTime() / 1000).toString();
    const historyResponse = await request.get(
        `${timeMachineUrl}forecast/${process.env.PW_TOKEN}/${latitude},${longitude},${timestamp}`
    );

    expect(await historyResponse.json()).toHaveProperty('currently.temperature');
});
