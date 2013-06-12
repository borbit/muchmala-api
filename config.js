module.exports = {
  host: process.env.API_HOST || '0.0.0.0'
, port: process.env.API_PORT || '8003'
, redis: process.env.REDIS_URL || 'redis://localhost:6379'
};