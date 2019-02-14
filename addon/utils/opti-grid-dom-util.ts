import Table from "opti-grid/components/table-items/grid";
import {later} from "@ember/runloop";
/**
 * interface for Dom Interaction
 * adds some methods for distant interaction with table over DOM
 * //FIXME this leaks state all over the place, see if this can be done with jqQuery
 */
const ROW_HEIGHT = 24;
export default class OptiGridDomUtil {


    constructor(table: Table){
        this.addMethods(table);
    }

    addMethods(table: Table){

        let element = table.element as IOptiTableElement;

        element.getOptiGridUtil = ()=>{ return this; };

        element.getRowIndexById = (id)=>{
            let record = table.sortedRecords.findBy('id', `${id}`);
            if (record) {
                return table.sortedRecords.indexOf(record);
            }
            return -1;
        };

        element.renderAll = (render)=>{
            table.set('renderAll', render);
        };

        if (table.tableSettings.subGrid) {
            element.openRow = (id)=>{
                let index = element.getRowIndexById(id);
                if (index > -1) {
                    let row = table.rows.objectAt(index);
                    if (row) {
                        row.set('isExpanded', true);
                    }
                }
            }
        }

        element.scrollToRow = (id, selectRow)=>{
            let index = element.getRowIndexById(id);
            if (index > -1) {
                element.renderAll(true);
                let $wrapper = $(element).closest('.opti-grid-wrapper');
                if ($wrapper.length > 0) {
                    $wrapper.scrollTop(index * ROW_HEIGHT);
                    if (selectRow) {
                        let selectScrollRow = () => {
                            let $row = $(element).find(`tr[data-ot-id=${id}]`);
                            $row.addClass('opti-grid-selected')
                        };

                        if ($(element).find(`tr[data-ot-id=${id}]`).length <= 0) {
                            //@ts-ignore
                            later(()=>{ selectScrollRow() }, 500)
                        } else {
                            selectScrollRow();
                        }
                    }
                }
            }
        }
    }

}

export interface IOptiTableElement extends HTMLTableElement {
    getRowIndexById(id: string | number) : number;
    scrollToRow(id: string | number, selectRow: boolean) : void;
    getOptiGridUtil() : OptiGridDomUtil;
    renderAll(renderAll: boolean) : void;
    openRow(id: string | number) : void;
}
