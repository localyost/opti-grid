import Row from "opti-grid/objects/Row";
import {isEmpty} from "@ember/utils";
import ArrayProxy from "@ember/array/proxy";

export default function selectRows(row: Row, allRows: ArrayProxy<Row>, event: MouseEvent, rightClick: boolean) {
    let {shiftKey, ctrlKey} = event ? event : { shiftKey: false, ctrlKey: false };
    if (!ctrlKey && !shiftKey) {
        if (!rightClick) {
            clearAllRowSelections(allRows);
            row.set('isSelected', true);
        } else {
            if (!row.isSelected) {
                clearAllRowSelections(allRows);
                row.set('isSelected', true);
            } else {
                row.set('isSelected', true);
            }
        }
    }
    if (ctrlKey && !shiftKey) {
        if (row.isSelected) {
            row.set('isSelected', false);
        } else {
            row.set('isSelected', true);
        }
    }
    if (shiftKey) {
        let lastSelected = allRows.filterBy('isSelected', true).get('lastObject');
        if (!lastSelected) {
            row.set('isSelected', true);
        } else {
            let lastSelectedIndex = allRows.indexOf(lastSelected);
            let currentSelectedIndex = allRows.indexOf(row);
            let filter;
            // select down
            if (lastSelectedIndex < currentSelectedIndex) {
                filter = allRows.slice(lastSelectedIndex, currentSelectedIndex + 1);
            }
            // select up
            if (lastSelectedIndex > currentSelectedIndex) {
                filter = allRows.slice(currentSelectedIndex, lastSelectedIndex);
            }

            // for some reason it's removing the selected on last row
            lastSelected.$element.addClass('opti-grid-selected');

            if (filter && !isEmpty(filter)) {
                filter.forEach((row: Row)=>{
                    row.set('isSelected', true);
                });
            }
        }
    }

    return allRows.filterBy('isSelected', true);
}

export function clearAllRowSelections(allRows: ArrayProxy<Row>) {
    allRows.filterBy('isSelected', true).forEach((row: Row)=>{
        row.set('isSelected', false);
    });
}
