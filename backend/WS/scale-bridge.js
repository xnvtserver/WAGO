const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db',
  password: 'your_db_password',
  port: 5432,
});

const wss = new WebSocket.Server({ port: 8080 });
const activeConnections = new Map(); // shopId -> { ws, ports }

wss.on('connection', async (ws, req) => {
  const shopId = validateAuth(req.headers['authorization']);
  if (!shopId) return ws.close();

  // Get shop configuration
  const config = await getScaleConfig(shopId);
  if (!config) return ws.send(JSON.stringify({ error: 'Scale not configured' }));

  // Store connection
  activeConnections.set(shopId, { ws, ports: new Map() });

  ws.on('message', async (message) => {
    const { type, data } = JSON.parse(message);
    if (type === 'connect-scale') {
      await handleScaleConnection(shopId, config, data.deviceId);
    }
  });

  ws.on('close', () => cleanUp(shopId));
});

async function handleScaleConnection(shopId, config, deviceId) {
  const scalePort = new SerialPort({
    path: deviceId,
    baudRate: config.serial_config.baudRate,
    dataBits: config.serial_config.dataBits,
    stopBits: config.serial_config.stopBits,
    parity: config.serial_config.parity
  });

  scalePort.on('data', data => {
    const weight = parseData(config.protocol, data, config.data_parsing_config);
    sendToShop(shopId, { type: 'weight', weight });
  });

  activeConnections.get(shopId).ports.set(deviceId, scalePort);
}

function parseData(protocol, data, config) {
  switch(protocol) {
    case 'CAS_CI201A':
      return parseCASCI201A(data);
    case 'AVERY_BERKEL':
      return parseAveryBerkel(data);
    case 'METTLER_TOLEDO':
      return parseMettlerToledo(data, config);
    case 'CUSTOM':
      return parseCustom(data, config.regex);
  }
}

function parseCASCI201A(data) {
  // Implementation for CAS protocol
  const stx = data[0], etx = data[data.length - 1];
  if (stx !== 0x02 || etx !== 0x03) return null;
  return parseFloat(data.slice(2, -2).toString());
}

async function getScaleConfig(shopId) {
  const res = await pool.query(`
    SELECT protocol, serial_config, data_parsing_config 
    FROM scale_configurations 
    WHERE shop_id = $1
  `, [shopId]);
  return res.rows[0];
}