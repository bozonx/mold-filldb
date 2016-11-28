import _ from 'lodash';


class Filler {
  constructor(mold) {
    this.mold = mold;
    this.schema = mold.$$schemaManager.getFullSchema();
    //this.primitivesInserts = {};
  }

  fillDb() {
    this._schemaRecursuveAdd('', this.schema);
  }

  clearDb() {
    // TODO: наверное надо запросить в драйвере все корни или все докементы и удалить их
  }

  _getDev(dev) {
    if (_.isFunction(dev)) {
      return dev();
    }
    else if (_.isString(dev) || _.isNumber(dev)) {
      return dev;
    }
  }

  _convertSchemaPathToMold(schemaPath) {
    return schemaPath.replace(/.schema/, '');
  }

  _collectContainersData(currentPath, containerSchema, result) {
    _.each(containerSchema, (item, name) => {
      // TODO: not plainObject
      // TODO: поддержка других типов - collection и тд
      if (item.type == 'container' || item.type == 'document') {

      }
      else if (_.includes(['string', 'number', 'boolean'], item.type)) {
        const subPath = _.trimStart(`${currentPath}.${name}`, '.');
        result.push([subPath, this._getDev(item.dev)]);
      }
    })
  }

  _prepareItem(itemSchema) {
    const container = {};

    // TODO: поддержка других типов - collection и тд
    if (itemSchema.type == 'document' || itemSchema.type == 'container') {
      const result = [];
      this._collectContainersData('', itemSchema.schema, result);
      _.each(result, (item) => {
        _.set(container, item[0], item[1]);
      });
    }

    console.log(5555, container)

    return container;
   }

  _fillCollection(schemaPath, repeats, itemSchema) {
    const moldPath = this._convertSchemaPathToMold(schemaPath);
    console.log(222222, moldPath, repeats, itemSchema);

    for (let i=0; i < repeats; i++) {
      this.mold.child(moldPath).create(this._prepareItem(itemSchema));
    }
  }

  _fillContainer(schemaPath, value) {

    const moldPath = this._convertSchemaPathToMold(schemaPath);
    console.log(1111111, moldPath, value)
    //this.mold.children(moldPath).update({});
  }

  _schemaRecursuveAdd(currentPath, currentValue) {
    if (!_.isPlainObject(currentValue)) return;
    _.each(currentValue, (item, name) => {
      const subPath = _.trimStart(`${currentPath}.${name}`, '.');
      if (item.dev) {
        // TODO: надо наверное собрать все примитивы и установить разом
        if (_.isFunction(item.dev)) {
          this._fillContainer(subPath, item.dev());
        }
        else if (_.isString(item.dev) || _.isNumber(item.dev)) {
          this._fillContainer(subPath, item.dev);
        }
        else if (_.isPlainObject(item.dev) && _.isNumber(item.dev.repeat)) {
          this._fillCollection(subPath, item.dev.repeat, item.item);
        }
      }
      this._schemaRecursuveAdd(subPath, item);
    });
  }
}

export default function (mold) {
  return new Filler(mold);
}
