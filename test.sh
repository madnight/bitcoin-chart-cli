set -xe

node index.js
node index.js --coin ETC
node index.js --coin LTC
node index.js --coin XRP
node index.js --coin XMR --hours 90
node index.js --coin QTUM --hours 90
node index.js --coin QTUM --hours 20
node index.js --coin VIA --mins 120
node index.js --coin XEM --mins 30
node index.js --coin XEM --mins 30 --disable-legend
node index.js -d 2000
node index.js --coin DASH -d 800
node index.js -w 200 -h 80
node index.js -w 80 -h 5
node index.js --coin GNT --mins 60 -w 80 -h 5
node index.js --coin ETH --currency BTC -d 30
node index.js --coin ETH --currency USD
node index.js --coin ADA --currency USD
node index.js --coin ADA --currency IOT
node index.js --coin ADA --currency BTC
