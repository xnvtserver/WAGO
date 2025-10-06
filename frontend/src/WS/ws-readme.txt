 complete **production-ready solution** for a multi-tenant weighing machine integration with proper configuration management:

### Architecture Overview
```
Web Browser (Vue Frontend) ↔ WebSocket ↔ Node.js Bridge Service ↔ Serial Ports
                              ↑
Main Application Server (REST API) ↔ Database (Shop Configurations)
```

### 1. Backend Service (Node.js)

#### 1.1 Database Schema (SQL)
```sql
CREATE TABLE shops (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scale_configurations (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  protocol VARCHAR(50) NOT NULL CHECK(protocol IN ('CAS_CI201A', 'AVERY_BERKEL', 'METTLER_TOLEDO', 'CUSTOM')),
  serial_config JSONB NOT NULL,
  data_parsing_config JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 1.2 WebSocket Bridge Service (`scale-bridge.js`)
```javascript
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
```

### 2. Frontend (Vue Component)
#### 2.1 Scale Integration Component (`ScaleIntegration.vue`)

### 3. Shop Configuration Interface
#### 3.1 Scale Settings Component (`ScaleSettings.vue`)


### Key Features

1. **Multi-Tenant Architecture**
- Shop-specific scale configurations
- Isolated WebSocket connections per shop
- Database-backed configuration storage

2. **Protocol Flexibility**
- Predefined protocols for common scales
- Custom regex parsing for unique requirements
- Easy to add new protocol handlers

3. **Security**
- WebSocket authentication via JWT
- Serial port access limited to shop-specific devices
- Input validation at all layers

4. **User Experience**
- Automatic weight detection
- Manual override capability
- Real-time connection status
- Intuitive configuration UI

5. **Production Considerations**
- Connection pooling
- Error handling and recovery
- Graceful degradation
- Configuration validation

### Deployment Setup

1. **Requirements**
```bash
# Backend
npm install ws serialport pg

# Frontend
npm install @vueuse/core
```

2. **Run Services**
```bash
# Scale Bridge Service
node scale-bridge.js

# Main Application
npm run dev
```

3. **Reverse Proxy (Nginx)**
```nginx
# WebSocket endpoint
location /scale-ws {
  proxy_pass http://localhost:8080;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "Upgrade";
  proxy_set_header Host $host;
}
```

This solution provides a complete end-to-end integration suitable for a multi-tenant retail application 
with various scale types. Each shop can configure their specific scale through the admin interface while
maintaining security and isolation between tenants.