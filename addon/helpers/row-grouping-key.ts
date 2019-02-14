import {helper} from '@ember/component/helper'
import {IRow} from "opti-grid/components/table-items/row-grouping-body";
import Formatters from "opti-grid/objects/enums/Formatters";
import moment from 'moment';
import {formatNumber} from "opti-grid/components/table-items/formatters/number";

// formatting for the TD in RowGroupingBody
export function rowGroupingKey(params: [IRow]) {
    let [ row ] = params;

    switch (row.formatter) {
        case Formatters.DATE:
            return moment(row.key).format(row.formatterOptions as string);
        case Formatters.NUMBER:
            return formatNumber(row.key as number);
        default:
            return row.key;
    }
}

export default helper(rowGroupingKey);
