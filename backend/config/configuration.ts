export default () => ({
  port: parseInt(process.env.PORT, 10) || 8888,
  esHost: process.env.ES_HOST || 'localhost',
  esIndex: process.env.ES_INDEX || 'default',
});
