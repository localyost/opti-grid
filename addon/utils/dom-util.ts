import {scheduleOnce} from "@ember/runloop";
import OptiGrid from "opti-grid/components/opti-grid";
import Table from "opti-grid/components/table-items/grid";
import {isPresent} from "@ember/utils";
import Column from "opti-grid/objects/Column";

/**
 * internal Dom util
 */
export default class DomUtil {

    $grid: JQuery;

    constructor($grid: JQuery){
        this.$grid = $grid;
    }

    initiateStickyHeader(gridLevel?: number){
        if (gridLevel === 0) {
            //@ts-ignore
            this.$grid.tableHeadFixer({head:true});
        }
    }

    // the method to be called after resizing
    activateResizeColumns(resizeCallBack: Function, component: OptiGrid | Table){
        let disabledColumns = getNonResizeRowIndices(component);
        //@ts-ignore
        this.$grid.colResizable({
            disable: false,
            disabledColumns,
            // headerOnly: true,
            onResize(){
                resizeCallBack();
            }
        });

        if (component.tableSettings.level === 0) {
            //@ts-ignore
            this.$grid.tableHeadFixer({head:true});
        }
    }

    runOnManipulation(callBack: Function, component: OptiGrid | Table){
        //@ts-ignore
        this.$grid.colResizable({
            disable: true
        });
        scheduleOnce('afterRender', this, 'activateResizeColumns', callBack, component);
    }

}
function getNonResizeRowIndices(component: OptiGrid | Table){
    let indices: number[] = [];
    let usesSubGrid = isPresent(component.tableSettings.subGrid);
    if (usesSubGrid) {
        indices.push(0);
    }
    component.columns.forEach((column: Column, index: number)=>{
        if (!column.settings.resizable) {
            let pushIndex = usesSubGrid ? index + 1 : index;
            indices.push(pushIndex);
        }
    });
    return indices;
}
