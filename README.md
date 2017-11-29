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
const fs = require('fs');

const convert = async () => {
	const data = await word2pdf('test.docx')
	fs.writeFileSync('test.pdf', data);
}
```

