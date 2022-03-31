const { getColorRGB, close } = require("./resources/colorSource");
const { getColorSheet, updateColorSheet } = require("./resources/sheets");

(async () => {
  const colorCodes = (await getColorSheet()).map(
    ([colorCellA, colorCellB, colorCode, colorName, , , retry]) => ({
      colorCode,
      retry,
    })
  );

  for (const [idx, { colorCode, retry }] of Object.entries(colorCodes)) {
    if (
      idx === "0" ||
      colorCode === "" ||
      colorCode === undefined ||
      retry !== "x"
    ) {
      continue;
    }

    console.log(`Getting Color[${idx}] ${colorCode}`);
    const rgb = await getColorRGB(colorCode);

    console.log(`RGB is`, rgb);
    await updateColorSheet({
      range: {
        sheetId: 967613591,
        startColumnIndex: 1,
        endColumnIndex: 2,
        startRowIndex: Number(idx),
        endRowIndex: Number(idx) + 1,
      },
      backgroundColor: rgb,
    });
  }

  // await close();
})()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
