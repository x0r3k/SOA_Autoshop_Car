function isNumber(value) {
    return !isNaN(+value) && (typeof value == 'string' || typeof value == 'number');
}
  
module.exports = isNumber;