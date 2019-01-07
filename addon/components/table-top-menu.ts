import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/table-top-menu';
import { layout, classNames } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Column from "opti-grid/objects/Column";
import {set} from "@ember/object";
import ArrayProxy from "@ember/array/proxy";
import IDnDComponent from "opti-grid/objects/interfaces/IDnDComponent";
import ITableSettings from "opti-grid/objects/interfaces/ITableSettings";
import {isPresent} from "@ember/utils";
@layout(template)
@classNames('ui attached segment opti-grid top-menu')
export default class TableTopMenu extends Component implements IDnDComponent {

    rowGrouping!: ArrayProxy<Column>;
    columns!: ArrayProxy<Column>;
    tableSettings!: ITableSettings;

    @action
    onRowSortSelect(selectedColumn: Column){
        set( selectedColumn, 'isGrouping', true );
        this.rowGrouping.addObject(selectedColumn);
    }

    @action
    removeColumnFromSorting(rowSortingColumn: Column){
        set( rowSortingColumn, 'isGrouping', false );
        this.rowGrouping.removeObject(rowSortingColumn);
    }

    dragEnter(event: DragEvent): void {
        this.$().css('border-color', 'red');
        event.preventDefault();
    }

    dragLeave(event: DragEvent): void {
        this.$().css('border-color', '#d4d4d5');
        event.preventDefault();
    }

    dragOver(event: DragEvent): void {
        event.preventDefault();
    }

    drop(event: DragEvent): void {
        this.$().css('border-color', '#d4d4d5');
        let dragColumnIndex = event.dataTransfer.getData('text/data');
        let fromColumn = this.columns.objectAt(parseInt(dragColumnIndex)) as Column;
        if (isPresent(fromColumn) && !fromColumn.isGrouping) {
            this.send('onRowSortSelect', fromColumn);
        }
        event.preventDefault();
    }


};


export interface IOnRowSortSelect {
    (column: Column) : void
}

export interface IRemoveColumnFromSorting {
    (rowSortingColumn: Column) : void
}
