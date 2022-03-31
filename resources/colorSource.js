const puppeteer = require("puppeteer-core");

const LOCAL_CHROME_INSTALLED_PATH = "/usr/bin/google-chrome";

const browserPromise = puppeteer.launch({
  executablePath: LOCAL_CHROME_INSTALLED_PATH,
  headless: true,
});

const colorPagePromise = browserPromise
  .then((browser) => browser.pages())
  .then(async ([page]) => {
    await page.goto("https://www.qtccolor.com/secaiku/", {
      waitUntil: "domcontentloaded",
    });
    // page.on("console", (consoleObj) => console.log(consoleObj.text()));
    return page;
  });

module.exports = {
  getColorRGB: async (colorCode) => {
    const colorPage = await colorPagePromise;

    await colorPage.click(".search-color-form");
    await colorPage.type("#word", colorCode);
    await new Promise((resolve) => setTimeout(() => resolve(), 500));
    await colorPage.click("#search_btn");
    await new Promise((resolve) => setTimeout(() => resolve(), 1500));

    const rgb = await colorPage.evaluate(() => {
      const $rgb = document.querySelectorAll(".cmyk");

      if (!$rgb) {
        return null;
      }

      const [red, green, blue] = Array.from($rgb || []).map(
        (node) => 256 - Number(node.innerText)
      );

      return {
        red,
        green,
        blue,
      };
    });

    return rgb;
  },
  close: async () => (await browserPromise).close(),
};
