import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function searchForMeridian(page: Page) {
  await page.goto("/");
  await page.getByRole("searchbox", { name: "Entity name or GCIF" }).fill("Meridian");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Matches (1)" })).toBeVisible();
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
}

test("search validates input, returns matches, and handles an empty result", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Entity Search", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Matches (0)" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("01-entity-search.png"), fullPage: true });

  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("Enter an entity name or GCIF to search.");
  await expect(page.getByRole("searchbox")).toHaveAttribute("aria-invalid", "true");

  await page.getByRole("searchbox").fill("no-such-entity-qa");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("No entities found for", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Matches (0)" })).toBeVisible();

  await page.getByRole("searchbox").fill("Meridian");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Matches (1)" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Meridian Global Resources Ltd" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Confirm entity Meridian Global Resources Ltd" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("02-search-result.png"), fullPage: true });
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("search recovers from a failed API request", async ({ page }) => {
  await page.route("**/api/entities?*", (route) => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("/");
  await page.getByRole("searchbox").fill("Meridian");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("We couldn’t search the entity directory. Please try again.");
  await expect(page.getByRole("button", { name: "Search", exact: true })).toBeEnabled();
  await page.unroute("**/api/entities?*");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Matches (1)" })).toBeVisible();
});

test("mobile navigation and search fit a 390px viewport", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expectNoHorizontalOverflow(page);
  const navigationToggle = page.getByRole("button", { name: "Open navigation", exact: true });
  await expect(navigationToggle).toHaveAttribute("aria-expanded", "false");
  await navigationToggle.click();
  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Search Entity" })).toHaveAttribute("aria-current", "page");
  await navigation.getByRole("link", { name: "Search Entity" }).click();
  await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toHaveAttribute("aria-expanded", "false");
  await searchForMeridian(page);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("mobile-search.png"), fullPage: true });
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("a confirmed entity can be screened, reviewed, and composed into a memo", async ({ page }, testInfo) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  await searchForMeridian(page);
  await page.getByRole("link", { name: "Confirm entity Meridian Global Resources Ltd" }).click();
  await expect(page).toHaveURL(/\/entities\/ENT-001$/);
  await expect(page.getByRole("heading", { name: "Subject entity profile" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Group structure" })).toBeVisible();
  await page.getByLabel("Assigned Officer", { exact: true }).fill("Alex Morgan");
  await page.getByLabel("Transaction Type", { exact: true }).selectOption("Annual review");
  await page.getByLabel("Facility Description", { exact: true }).fill("Annual review of the group facility.");
  await page.screenshot({ path: testInfo.outputPath("03-overview.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);

  const overviewTab = page.getByRole("tab", { name: "Overview & Structure" });
  await overviewTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Screening & Assessment" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "Screening & Assessment" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(overviewTab).toBeFocused();

  await page.getByRole("button", { name: "Launch Screening Engine" }).click();
  await expect(page.getByRole("heading", { name: "Screening engine is running" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("04-screening-running.png"), fullPage: true });
  await expect(page.getByRole("heading", { name: "Negative news findings" })).toBeVisible();

  const governanceTitle = "Meridian Global Resources faces shareholder resolution on plantation disclosure";
  const labourTitle = "Investigation finds recruitment fee debt among migrant harvesters at Kalimantan estates";
  const governance = page.getByRole("article", { name: governanceTitle });
  const labour = page.getByRole("article", { name: labourTitle });
  await governance.getByRole("button", { name: "Include", exact: true }).click();
  await expect(governance.getByRole("button", { name: "Include", exact: true })).toHaveAttribute("aria-pressed", "true");
  await governance.getByRole("combobox").selectOption("high");
  await governance.getByRole("textbox").fill("Retain this governance finding for review.");
  await labour.getByRole("button", { name: "Exclude", exact: true }).click();
  await expect(labour.getByRole("button", { name: "Exclude", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({ path: testInfo.outputPath("05-screening-assessment.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);

  await page.getByRole("tab", { name: "Memo Preview" }).click();
  const memorandum = page.getByRole("article", { name: "Screening memorandum" });
  await expect(memorandum.getByText("Alex Morgan", { exact: true })).toBeVisible();
  await expect(memorandum.getByText("Annual review", { exact: true })).toBeVisible();
  await expect(memorandum.getByText("Annual review of the group facility.", { exact: true })).toBeVisible();
  await expect(memorandum.getByRole("heading", { name: "Included findings (1)" })).toBeVisible();
  await expect(memorandum.getByRole("heading", { name: governanceTitle })).toBeVisible();
  await expect(memorandum.getByRole("heading", { name: labourTitle })).toHaveCount(0);
  await expect(memorandum.getByText("Reviewer notes: Retain this governance finding for review.")).toBeVisible();

  await page.getByLabel("Policy notes", { exact: true }).fill("Confirm the latest sector assessment.");
  await page.getByLabel("Equator principles", { exact: true }).check();
  await page.getByLabel("Assessed risk level", { exact: true }).selectOption("medium");
  await page.getByLabel("Risk rationale", { exact: true }).fill("Controls reduce the assessed residual risk.");
  await expect(memorandum.getByText("Controls reduce the assessed residual risk.", { exact: true })).toBeVisible();
  await expect(memorandum.getByText("Policy notes: Confirm the latest sector assessment.")).toBeVisible();
  await expect(memorandum.getByText("Sensitive sector: Palm oil. Equator Principles: Applicable.")).toBeVisible();
  await expect(memorandum.getByText(/^medium risk$/i)).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("06-memo-preview.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  expect(runtimeErrors).toEqual([]);
});

test("case overview, assessment, and memo fit a mobile viewport", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/entities/ENT-001");
  await expect(page.getByRole("heading", { name: "Subject entity profile" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.getByRole("button", { name: "Launch Screening Engine" }).click();
  await expect(page.getByRole("heading", { name: "Negative news findings" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.getByRole("article").first().getByRole("button", { name: "Include", exact: true }).click();
  await page.getByRole("tab", { name: "Memo Preview" }).click();
  await expect(page.getByRole("heading", { name: "Included findings (1)" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("mobile-memo.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("API routes validate empty, malformed, unknown, and cross-origin requests", async ({ request }) => {
  const emptySearch = await request.get("/api/entities?q=");
  expect(emptySearch.status()).toBe(400);
  expect(await emptySearch.json()).toEqual({ error: "Enter a valid search of 1 to 120 characters." });

  const malformedScreening = await request.post("/api/screenings", {
    headers: { "Content-Type": "application/json" },
    data: Buffer.from("{not-json"),
  });
  expect(malformedScreening.status()).toBe(400);
  expect(await malformedScreening.json()).toEqual({ error: "Invalid request." });

  const invalidScreening = await request.post("/api/screenings", { data: { entityId: 123 } });
  expect(invalidScreening.status()).toBe(400);

  const unknownScreening = await request.post("/api/screenings", { data: { entityId: "missing-entity" } });
  expect(unknownScreening.status()).toBe(404);
  expect(await unknownScreening.json()).toEqual({ error: "Entity not found." });

  const crossOriginScreening = await request.post("/api/screenings", {
    headers: { Origin: "https://untrusted.example" },
    data: { entityId: "ENT-001" },
  });
  expect(crossOriginScreening.status()).toBe(403);
  expect(await crossOriginScreening.json()).toEqual({ error: "Request not permitted." });
});
