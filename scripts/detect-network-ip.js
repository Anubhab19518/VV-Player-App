const fs = require('fs');
const path = require('path');
const os = require('os');

function getPrimaryNetworkIp() {
  const nets = os.networkInterfaces();
  const candidates = [];

  for (const name of Object.keys(nets)) {
    const isVirtual = /virtual|vethernet|hyper-v|wsl|loopback|docker|vmnet/i.test(name);
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254')) {
        candidates.push({
          interface: name,
          address: net.address,
          isVirtual,
        });
      }
    }
  }

  // Priority 1: Non-virtual physical network interface (e.g. Wi-Fi, Ethernet)
  const physical = candidates.find((c) => !c.isVirtual);
  if (physical) {
    return physical.address;
  }

  // Priority 2: Any non-internal IPv4
  if (candidates.length > 0) {
    return candidates[0].address;
  }

  return 'localhost';
}

function updateEnvFile(ip, port = 3000) {
  const envPath = path.join(__dirname, '..', '.env');
  const baseUrl = `http://${ip}:${port}/api/v1`;
  const envKey = 'EXPO_PUBLIC_API_BASE_URL';
  const newLine = `${envKey}=${baseUrl}`;

  let content = '';
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8');
    const regex = new RegExp(`^${envKey}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, newLine);
    } else {
      content = content.trim() ? `${content.trim()}\n${newLine}\n` : `${newLine}\n`;
    }
  } else {
    content = `${newLine}\n`;
  }

  fs.writeFileSync(envPath, content, 'utf8');
  console.log(`[Network Config] Successfully resolved IP: ${ip}`);
  console.log(`[Network Config] Updated .env: ${newLine}`);
  return baseUrl;
}

if (require.main === module) {
  const ip = getPrimaryNetworkIp();
  updateEnvFile(ip);
}

module.exports = { getPrimaryNetworkIp, updateEnvFile };
