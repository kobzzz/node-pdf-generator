# node-pdf-generator
### Node.js service for generating PDF via URL.
#### Features:
* Pure Node.js
* Dockerized to run in production mode
* Includes Basic Authentication strategy
* Logging via [morgan](https://github.com/expressjs/morgan)
* Log-colouring via [chalk](https://github.com/chalk/chalk)
* Node.js friendly ESLint setup
* Puppeeter that *[just](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md)* works in Docker
#### How to run:
Install LTS Docker, build the image and run the container with the option ```-p 8080:8080```
#### API:
Simply send ```POST``` request with a correct ```Authorization``` header. Currently the service supports only the following query paramater ```?orientation=landscape```, but you can easily setup your own ones!
