const https = require('https');
const fs = require('fs');

function downloadPlotly(path, name) {
  return new Promise((resolve, reject) => {
    https
      .get(`https://cdn.plot.ly/${path}`, resp => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          const b64Data = Buffer.from(data).toString('base64');
          const fileContent = `const content = \`${b64Data}\`;\nexport default content;\n`;
          fs.writeFile(`src/lib/${name}.ts`, fileContent, err => {
            if (err) reject(err);
            else resolve(data);
          });
        });
      })
      .on('error', err => {
        reject(err);
      });
  });
}

function main() {
  return Promise.all([
    downloadPlotly('plotly-latest.min.js', 'PlotlyFull'),
    downloadPlotly('plotly-basic-latest.min.js', 'PlotlyBasic'),
  ]).then(([s]) => {
    const v = s.slice(17, 26);
    console.log(`Updated to version ${v}`);
  });
}

main()
  .then(() => console.log('Finished!'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
