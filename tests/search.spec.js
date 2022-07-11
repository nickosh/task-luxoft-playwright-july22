const { test, expect } = require("@playwright/test");
const exp = require("constants");

test.describe("Aviasales: Search page", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("https://www.aviasales.com/");
        await page.waitForLoadState();
        await expect(page).toHaveURL(/.*[www.aviasales.com/].*/);
    });

    test("Open search page with parameters", async ({ page }) => {
        let aviaOrig = page.locator('[class="avia-form__field --origin"] input');
        let aviaDest = page.locator('[class="avia-form__field --destination"] input');
        let dateDepart = page.locator('div[class="trip-duration__input-wrapper --departure"]');
        let passengers = page.locator('[class="avia-form__field --passengers"]');

        await test.step("Enable Night Theme", async () => {
            await page.locator('[data-test-id="switch"] span').first().click();
        });
        await test.step("For FROM field set NEW York, Kennedy airport", async () => {
            await aviaOrig.fill("New Yor");
            await page.locator('text="John F. Kennedy International Airport"').click();
            await expect(page).toHaveURL("https://www.aviasales.com/?params=JFK1");
        });
        await test.step("For TO field set Berlin", async () => {
            await aviaDest.fill("Berlin");
            await expect(page).toHaveURL("https://www.aviasales.com/?params=JFKBER1");
        });
        await test.step("For DATE field set July, 30", async () => {
            await dateDepart.click();
            await page.locator('div[class="trip-duration__dropdown"]').waitFor();
            await page.locator(".calendar-caption__select").first().selectOption("2022-07");
            await page.locator('[aria-label="Sat Jul 30 2022"]').click();
        });
        await test.step("No returning ticket", async () => {
            await page.locator('button:has-text("I don’t need a return ticket")').click();
            await expect(page).toHaveURL("https://www.aviasales.com/?params=JFK3007BER1");
        });
        await test.step("Passengers – 2", async () => {
            await page.locator('div[class="avia-form__field --passengers"]').click();
            await page.locator('div[class="additional-fields__passengers-wrap"]').waitFor();
            let adultsBlock = page.locator('div[class="additional-fields__passenger-row"]').first();
            expect(adultsBlock.locator('span[class="additional-fields__passenger-value"]')).toContainText("1");
            await adultsBlock.locator('a[class="additional-fields__passenger-control --increment"]').click();
            expect(adultsBlock.locator('span[class="additional-fields__passenger-value"]')).toContainText("2");
            await page.locator('div[class="avia-form__field --passengers"]').click();
            await expect(page).toHaveURL("https://www.aviasales.com/?params=JFK3007BER2");
        });
        await test.step("Click search flight", async () => {
            let hotelBooking = page.locator('[data-test-id="checkbox-booking"]');
            if (await hotelBooking.isVisible()) {
                await hotelBooking.click();
            }
            await page.locator('button:has-text("Search flights")').click();
        });
        await test.step("Assertions", async () => {
            await page.waitForLoadState();
            await page.waitForURL(/.*[www.aviasales.com/search/JFK3007BER2].*/);
            await expect(page).toHaveURL(/.*[www.aviasales.com/search/JFK3007BER2].*/);
            await expect(aviaOrig).toHaveValue("New York");
            await expect(page.locator('[class="autocomplete__iata"]').nth(0)).toContainText("JFK");
            await expect(aviaDest).toHaveValue("Berlin");
            await expect(page.locator('[class="autocomplete__iata"]').nth(1)).toContainText("BER");
            await expect(page.locator('input[placeholder="Depart"]')).toHaveValue("Sat, July 30");
            await expect(page.locator('input[placeholder="Return"]')).toHaveValue("");
            await expect(passengers).toContainText("2 passengers");
        });
    });
});
