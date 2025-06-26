
const getClientInfo = (req) => {
  let ip;

  ip = req.ip
  if (ip === '::1') return '127.0.0.1';

  // IPv4-mapped IPv6
  if (ip.startsWith('::ffff:')) return ip.replace('::ffff:', '');


  const userAgent = req.headers['user-agent'] || 'Unknown';


  return { ip, userAgent };
};

module.exports = getClientInfo