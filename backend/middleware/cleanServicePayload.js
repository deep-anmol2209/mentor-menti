function cleanServicePayload(req, res, next) {
    if (req.body.availability) {
      req.body.availability = req.body.availability.map(({ _id, ...rest }) => rest);
    }
  
    next();
  }

  module.exports = cleanServicePayload;