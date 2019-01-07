import Helper from '@ember/component/helper';
import moment from 'moment';
import Column from "opti-grid/objects/Column";
export default class DateDisplay extends Helper {

    compute(_params: any, hash: { column: Column, value: number }){
        let { column, value } = hash;
        let dateFormat = column.settings.formatterOptions || 'DD.MM';
        return formatDate(value, dateFormat);
     }
}

export function formatDate(value: number, dateFormat: string) {
    return moment(value).format(dateFormat);
}
