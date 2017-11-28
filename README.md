#Install package 

Run cmd with 
```sh
npm i word2pdf
```
 or 
 ```sh
 yarn add word2pdf
 ```

#Use

Example

```javascript
const word2pdf = require('word2pdf');

word2pdf('test.docx', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  fs.writeFileSync('test.pdf', data);
});
```

