module.exports = {
  datetime: timestamp => new Date(timestamp / 1000).toISOString()
};