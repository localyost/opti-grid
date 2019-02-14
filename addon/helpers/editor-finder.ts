import {helper} from '@ember/component/helper';
import Column from "opti-grid/objects/Column";
import Editables from "opti-grid/objects/Editables";

export function editorFinder(params: Column[]) {
    let [column] = params;
    let editable = column.settings.editable;
    if (editable) {
        switch (editable.type) {
            case Editables.INPUT:
                return Editables.INPUT;
            default:
                return editable.type;
        }
    }


    return Editables.DEFAULT ;
}

export default helper(editorFinder);
