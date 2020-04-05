const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");

const word2pdf = async (path) => {
  const homepage = async () => {
    const jar = request.jar();
    const html = await new Promise((resolve, reject) => {
      const req = request(
        {
          url: "https://convertonlinefree.com",
          method: "GET",
          jar: jar,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 Safari/537.36",
          },
        },
        (err, res) => {
          if (err) return reject(err);
          resolve(res.body);
        }
      );
    });
    const $ = cheerio.load(html);
    return {
      __VIEWSTATE: $("#__VIEWSTATE").attr("value"),
      __VIEWSTATEGENERATOR: $("#__VIEWSTATEGENERATOR").attr("value"),
      __EVENTVALIDATION: $("#__EVENTVALIDATION").attr("value"),
      hfConversionID: $("#hfConversionID").attr("value"),
      jar,
    };
  };

  const buffer = await new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  const hiddens = await homepage();

  const data = await new Promise((resolve, reject) => {
    const req = request(
      {
        url: "https://convertonlinefree.com",
        method: "POST",
        encoding: null,
        jar: hiddens.jar,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 Safari/537.36",
        },
      },
      (err, res) => {
        if (err) return reject(err);
        resolve(res.body);
      }
    );
    const form = req.form();
    form.append("__EVENTTARGET", "");
    form.append("__EVENTARGUMENT", "");
    form.append("__VIEWSTATEENCRYPTED", "");
    form.append("__VIEWSTATE", hiddens.__VIEWSTATE);
    form.append("__VIEWSTATEGENERATOR", hiddens.__VIEWSTATEGENERATOR);
    form.append("__EVENTVALIDATION", hiddens.__EVENTVALIDATION);
    form.append("ctl00$hfConversionID", hiddens.hfConversionID);
    form.append("ctl00$MainContent$fu", buffer, {
      filename: "output.docx",
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    form.append("ctl00$MainContent$btnConvert", "Convert");
    form.append("ctl00$MainContent$fuZip", "");
  });

  return data;
};

module.exports = word2pdf;
