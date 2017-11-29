const request = require('request');
const fs = require('fs');

const word2pdf = async path => {
  const buffer = await new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  const data = await new Promise((resolve, reject) => {
    const req = request.post(
      'http://mirror1.convertonlinefree.com',
      {
        encoding: null,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 Safari/537.36'
        }
      },
      (err, res) => {
        if (err) return reject(err);
        resolve(res.body);
      }
    );
    const form = req.form();
    form.append('__EVENTTARGET', '');
    form.append('__EVENTARGUMENT', '');
    form.append('__VIEWSTATE', '');
    form.append('ctl00$MainContent$fu', buffer, {
      filename: 'output.docx',
      contentType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    form.append('ctl00$MainContent$btnConvert', 'Convert');
    form.append('ctl00$MainContent$fuZip', '');
  });

  return data;
};

module.exports = word2pdf;
