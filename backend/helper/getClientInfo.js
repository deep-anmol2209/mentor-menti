const getClientInfo = (req) => {
    const ip = req.headers['x-forwarded-for']
      ? req.headers['x-forwarded-for'].split(',')[0].trim()
      : req.socket?.remoteAddress || req.ip;
  
    const userAgent = req.headers['user-agent'] || 'Unknown';
  
    return { ip, userAgent };
  };

  module.exports= getClientInfo