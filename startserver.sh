
> wetterstation@1.0.0 server /home/pi/Desktop/wetterstation
> npm-run-all --parallel auth pers weather-data backend database


> wetterstation@1.0.0 backend /home/pi/Desktop/wetterstation
> npm i && nodemon server.js


> wetterstation@1.0.0 database /home/pi/Desktop/wetterstation
> cd services/database-service && npm i && nodemon src/index.ts


> wetterstation@1.0.0 weather-data /home/pi/Desktop/wetterstation
> cd services/data-service && npm i && nodemon index.js


> wetterstation@1.0.0 auth /home/pi/Desktop/wetterstation
> cd services/auth-service && npm i && nodemon index.js


> wetterstation@1.0.0 pers /home/pi/Desktop/wetterstation
> cd services/personalization-service && npm i && nodemon index.js

audited 94 packages in 6.21s
audited 109 packages in 6.709s

1 package is looking for funding
  run `npm fund` for details

found 0 vulnerabilities

audited 101 packages in 6.999s

1 package is looking for funding
  run `npm fund` for details

found 0 vulnerabilities


1 package is looking for funding
  run `npm fund` for details

found 0 vulnerabilities

[33m[nodemon] 2.0.7[39m
[33m[nodemon] to restart at any time, enter `rs`[39m
[33m[nodemon] watching path(s): *.*[39m
[33m[nodemon] watching extensions: js,mjs,json[39m
[32m[nodemon] starting `node index.js`[39m
[33m[nodemon] 2.0.7[39m
[33m[nodemon] to restart at any time, enter `rs`[39m
[33m[nodemon] watching path(s): *.*[39m
[33m[nodemon] watching extensions: js,mjs,json[39m
[32m[nodemon] starting `node index.js`[39m
[33m[nodemon] 2.0.7[39m
[33m[nodemon] to restart at any time, enter `rs`[39m
[33m[nodemon] watching path(s): *.*[39m
[33m[nodemon] watching extensions: js,mjs,json[39m
[32m[nodemon] starting `node index.js`[39m
