import {helper} from '@ember/component/helper';
import Column from "opti-grid/objects/Column";
import {Formatters} from "opti-grid/objects/Formatters";

export function formatterFinder(params: [Column]) : string {
    let [column] = params;
    let formatter = column.settings.formatter;
    if (formatter) {
        switch (formatter) {
            case Formatters.IMAGE:
                return Formatters.IMAGE;
            case Formatters.DATE:
                return Formatters.DATE;
            default:
                return formatter;
        }
    }
    return Formatters.DEFAULT;

}

export default helper(formatterFinder);
