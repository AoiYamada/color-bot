const { google } = require("googleapis");

const SPREADSHEET_ID = "1YsnY8alX-b04RmUCd0CYgxPfXQBRHjvWnvcqxu9k9t0";

const auth = new google.auth.GoogleAuth({
  keyFile: `${__dirname}/../credentials/secrets.json`,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const { spreadsheets } = google.sheets({
  version: "v4",
  auth,
});

module.exports = {
  getColorSheet: async () => {
    const {
      data: { values },
    } = await spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Atlas",
    });

    return values;
  },
  updateColorSheet: async ({ range, backgroundColor }) => {
    return await spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            updateCells: {
              range,
              fields: "*",
              rows: [
                {
                  values: [
                    [
                      {
                        userEnteredFormat: {
                          backgroundColor,
                        },
                      },
                    ],
                  ],
                },
              ],
            },
          },
        ],
      },
    });
  },
};
