const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY;
const { info, error, success } = require('./settings/chalk');
const logger = require('./settings/logger');
const urlModule = require('url');
const finalHandler = require('finalhandler');
const puppeteer = require('puppeteer');
const querystring = require('querystring');

const server = require('http').createServer((req, res) => {
  const { method, url, headers } = req;
  const faultyRequestHandler = finalHandler(req, res);
  
  logger(req, res, (err) => {
    if (err) {
      faultyRequestHandler(err);
    }
    
    // Authorization header check
    if (!headers['authorization'] || headers['authorization'].slice(6) !== SECRET_KEY) {
      error('Request does not contain Authorization header or Auth key is invalid');
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm=Access to generate PDF files from URL');
      res.end();
      return;
    }
    
    if (method === 'POST') {
      let requestBody = [];
      req.on('data',(chunk) => {
        requestBody.push(chunk);
      }).on('end', () => {
        requestBody = Buffer.concat(requestBody).toString();
        success('Ended reading from body: ', requestBody);
        
        const requestQuery = querystring.parse(urlModule.parse(url).query);
        const orientation = requestQuery.orientation;
        const goToUrl = urlModule.parse(requestBody).href;
  
        (async() => {
          try {
            const browser = await puppeteer.launch({
              headless: true,
              timeout: 15000,
              args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
            });
  
            const page = await browser.newPage();
            await page.goto(goToUrl, {
              timeout: 15000,
              waitUntil: 'networkidle0',
            });
  
            info('Successfully proceeded to the webpage, now taking the PDF');
            const buffer = await page.pdf({
              format: 'A4',
              margin: {
                top: '80px',
                right: '70px',
                left: '70px',
                bottom: '50px',
              },
              scale: 0.8,
              landscape: orientation === 'landscape',
            });
  
            info('Got the buffer, sending it in the response body');
            browser.close();
            res.setHeader("Access-Control-Allow-Methods", "POST");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="yamaha-booklet.pdf"');
            res.write(buffer, () => {
              res.statusCode = 200;
              res.end();
            });
          } catch (e) {
            error('Error while generating PDF:', e);
            faultyRequestHandler(err);
          }
        })();
      });
    } else {
      error('Received error, sending the faulty response');
      res.statusCode = 405;
      faultyRequestHandler(req, res);
    }
  });
});

server.listen(PORT, () => {
  info('Server is running on ', PORT);
});
