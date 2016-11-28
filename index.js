import _ from 'lodash';

function _fillCollection(schemaPath, repeats, itemSchema) {
  console.log(222222, schemaPath, repeats, itemSchema)
}

function _fillPrimitive(schemaPath, value) {
  console.log(1111111, schemaPath, value)
}

function _schemaRecursuveAdd(currentPath, currentValue) {
  if (!_.isPlainObject(currentValue)) return;
  _.each(currentValue, function(item, name) {
    const subPath = `${currentPath}.${name}`;
    if (item.dev) {
      if (_.isFunction(item.dev)) {
        _fillPrimitive(subPath, item.dev());
      }
      else if (_.isString(item.dev) || _.isNumber(item.dev)) {
        _fillPrimitive(subPath, item.dev);
      }
      else if (_.isPlainObject(item.dev) && _.isNumber(item.dev)) {
        _fillCollection(subPath, item.dev, item.schema);
      }
    }
    _schemaRecursuveAdd(subPath, item);
  });
}


function fillDb(mold) {
  const schema = mold.$$schemaManager.getFullSchema();
  _schemaRecursuveAdd('', schema);
}

function clearDb(mold) {
  // TODO: заверное надо запросить в драйвере все корни или все докементы и удалить их
}

export default function (mold) {
  return {
    fillDb: () => fillDb(mold),
    clearDb: () => clearDb(mold),
  }
}
