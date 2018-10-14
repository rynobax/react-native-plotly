const https = require('https');
const fs = require('fs');

https.get('https://cdn.plot.ly/plotly-basic-latest.min.js', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    const b64Data = Buffer.from(data).toString('base64');
    const fileContent = `const content = \`${b64Data}\`;\nexport default content;\n`;
    fs.writeFileSync('src/lib/PlotlyBasic.ts', fileContent);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});