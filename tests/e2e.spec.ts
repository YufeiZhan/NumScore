import { test, expect } from '@playwright/test';

test('test to show the title of Joe\'s first notation can be modified.', async ({ page }) => {
  await page.goto('http://localhost:31000/api/login\?key\=foo-bar-baz\&user\=dalton\&role\=user');
  await page.getByRole('link', { name: 'plus lg' }).click();
  await page.waitForTimeout(4000);
  await page.locator(
    '.m-5 > div > a'
  ).first().click();
  await page.getByRole('button', { name: 'gear' }).click();
  await page.getByPlaceholder('Enter title').click();
  await page.getByPlaceholder('Enter title').fill('WIP Title');
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(4000);
  await page.goto('http://localhost:31000/home');
  await page.waitForTimeout(4000);
  await page.locator(
    '.m-5 > div > a'
  ).first().click();
  await page.waitForTimeout(4000);
  expect(await page.$eval('.m-5', x => (x as HTMLElement).innerText)).toBe('WIP Title');

});

test('test to show new notations can be added and only 1 is added at a time.', async ({ page }) => {
  await page.goto('http://localhost:31000/api/login\?key\=foo-bar-baz\&user\=jennie\&role\=user');
  await page.waitForTimeout(2000);
  const notationCountBefore = await page.locator(
    '.m-5 > div > a'
  ).count();
  await page.getByRole('link', { name: 'plus lg' }).click();
  await page.waitForTimeout(2000);
  const notationCountAfter = await page.locator(
    '.m-5 > div > a'
  ).count();
  await page.goto('http://localhost:31000/api/login\?key\=foo-bar-baz\&user\=jennie\&role\=user');
  await page.waitForTimeout(2000);
  expect(notationCountAfter - notationCountBefore).toBe(1);
});
