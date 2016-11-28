import _ from 'lodash';


class Filler {
  constructor(mold) {
    this.mold = mold;
    this.schema = mold.$$schemaManager.getFullSchema();
  }

  fillDb() {
    this._schemaRecursuveAdd('', this.schema);
  }

  clearDb() {
    // TODO: заверное надо запросить в драйвере все корни или все докементы и удалить их
  }

  _convertSchemaPathToMold(schemaPath) {
    return schemaPath.replace(/.schema/, '');
  }

  _fillCollection(schemaPath, repeats, itemSchema) {
    const moldPath = this._convertSchemaPathToMold(schemaPath);
    console.log(222222, moldPath, repeats, itemSchema)
  }

  _fillPrimitive(schemaPath, value) {
    const moldPath = this._convertSchemaPathToMold(schemaPath);
    console.log(1111111, moldPath, value)
  }

  _schemaRecursuveAdd(currentPath, currentValue) {
    if (!_.isPlainObject(currentValue)) return;
    _.each(currentValue, (item, name) => {
      const subPath = _.trimStart(`${currentPath}.${name}`, '.');
      if (item.dev) {
        if (_.isFunction(item.dev)) {
          this._fillPrimitive(subPath, item.dev());
        }
        else if (_.isString(item.dev) || _.isNumber(item.dev)) {
          this._fillPrimitive(subPath, item.dev);
        }
        else if (_.isPlainObject(item.dev) && _.isNumber(item.dev.repeat)) {
          this._fillCollection(subPath, item.dev, item.item);
        }
      }
      this._schemaRecursuveAdd(subPath, item);
    });
  }
}

export default function (mold) {
  return new Filler(mold);
}
