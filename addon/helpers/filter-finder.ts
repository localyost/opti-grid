import {helper} from '@ember/component/helper';
import Column from "opti-grid/objects/Column";
import Formatters from "opti-grid/objects/enums/Formatters";
import ColumnSearchTypes from "opti-grid/objects/enums/ColumnSearchTypes";

export function filterFinder(params: [Column]) {
    let [column] = params;
    let formatter = column.settings.formatter;
    if (formatter) {
        switch (formatter) {
            case Formatters.NUMBER:
                return ColumnSearchTypes.NUMBER;
            case Formatters.DATE:
                return ColumnSearchTypes.DATE;
            default:
                return ColumnSearchTypes.STRING;
        }
    }
    return ColumnSearchTypes.STRING;

}

export default helper(filterFinder);
