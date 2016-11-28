import _ from 'lodash';

function _schemaRecursuve() {

}


function fillDb(mold) {
  const schema = mold.$$schemaManager.getFullSchema();


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
