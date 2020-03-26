const redis = require('redis');
const url = require('url');

const redis_client = redis.createClient(6379);

const checkCachedShopProducts = (req, res, next) => {
  if (req.params.shopId) {
    const { shopId } = req.params;

    redis_client.get(`products_shop:${shopId}`, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }

      if (data != null) {
        data = JSON.parse(data);
        res.status(200).json({
          success: true,
          source: 'Redis. Is this faster???',
          total: data.length,
          data
        });
      } else {
        console.log(1);
        next();
      }
    });
  } else {
    console.log(2);
    next();
  }
};

const checkCachedAllProducts = (req, res, next) => {
  const getUrl = url.parse(req.url, true).href;
  redis_client.get(`products:${getUrl}`, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }

    if (data != null) {
      data = JSON.parse(data);
      res.status(200).json({
        success: true,
        source: 'Redis. Is this faster???',
        total: data.total,
        pagination: data.pagination,
        data: data.data
      });
    } else {
      next();
    }
  });
};

module.exports = { checkCachedShopProducts, checkCachedAllProducts };
