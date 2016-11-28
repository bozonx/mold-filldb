import _ from 'lodash';

function fillDb(mold) {

}

function clearDb(mold) {

}

export default function (mold) {
  return {
    fillDb: () => fillDb(mold),
    clearDb: () => clearDb(mold),
  }
}