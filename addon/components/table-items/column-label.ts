// @ts-ignore: Ignore import of compiled template
import template from '../../templates/components/table-items/column-label';
import TH from './th';
import {attribute, layout, className} from '@ember-decorators/component';
import {computed} from '@ember-decorators/object';
import IDnDComponent from "opti-grid/objects/interfaces/IDnDComponent";
import {IDidSort, IWillReorder} from "opti-grid/components/table-items/grid";
import {IOnReorder} from "opti-grid/components/table-items/thead";
import {SortTypes} from "opti-grid/objects/SortTypes";
// @ts-ignore
import { htmlSafe } from '@ember/template';
import ITableSettings from "opti-grid/objects/interfaces/ITableSettings";
import {isPresent} from "@ember/utils";

const ASC_LABEL = htmlSafe('icon sort down');
const DESC_LABEL = htmlSafe('icon sort up');

@layout(template)
export default class ColumnLabel extends TH implements IDnDComponent {

    willReorder!: IWillReorder;
    onReorder!: IOnReorder;
    didSort!: IDidSort;
    tableSettings!: ITableSettings;

    @attribute
    @computed
    get draggable(){
        return this.column.settings.draggable;
    }

    @computed
    get canSort(){
        if (this.tableSettings.columnSorting === false) {
            return false;
        }
        return this.column.settings.sortable;
    }

    @className('opti-grid-sortable-column') sortableColumnClass = this.canSort;

    @className
    @computed
    get nameClass() {
        return `opti-grid-column-${this.column.className}`;
    }

    @computed('column.sorting')
    get sortingIcon(){
        let sorting = this.column.sorting;
        if (!sorting) {
            return false;
        } else if(sorting === SortTypes.DESC){
            return DESC_LABEL
        } else if(sorting=== SortTypes.ASC){
            return ASC_LABEL
        }
    }

    dragStart(event: DragEvent){
        return event.dataTransfer.setData('text/data', this.column.index.toString());
    }

    dragEnter(event: DragEvent){
        if (this.draggable) {
            event.preventDefault();
            onDragOverStyle(this.$());
        }
    }

    dragLeave(event: DragEvent){
        if (this.draggable) {
            event.preventDefault();
            onDragLeaveStyle(this.$());
        }
    }

    dragOver(event: DragEvent){
        if (this.draggable) {
            event.preventDefault();
        }
    }

    drop(event: DragEvent){
        if (this.draggable) {
            this.willReorder();
            let dragColumnIndex = event.dataTransfer.getData('text/data');
            event.preventDefault();
            if(this.onReorder && isPresent(dragColumnIndex)) {
                this.onReorder(this.column.index, parseInt(dragColumnIndex));
            }

            onDragLeaveStyle(this.$());
        }
    }

    click(){
        if (this.canSort) {
            this.didSort(this.column);
        }
    }

};


const DRAG_OVER_CSS = '2px solid red';
function onDragOverStyle($th: JQuery) {
    $th.css('border-right', DRAG_OVER_CSS);
}

function onDragLeaveStyle($th: JQuery) {
    $th.css('border-right', '');
}
