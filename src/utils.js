exports.isObject = obj => obj !== null && obj.constructor.name === 'Object';

exports.isObjectEmpty = obj => !Object.keys(obj).length;

exports.findDefault = obj => Object.keys(obj).find(i => i.split(':').length > 1);

