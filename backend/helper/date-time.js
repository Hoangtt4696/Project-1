exports.setStartOfDay = function(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(1);
};

exports.setEndOfDay = function(date) {
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
};

exports.toTimestamp = function(date) {
  return (new Date(date)).getTime();
};