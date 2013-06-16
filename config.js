module.exports = {
  host: '0.0.0.0'
, port: process.env.PORT || '8003'
, redis: process.env.REDIS_URL || 'redis://localhost:6379'
};
