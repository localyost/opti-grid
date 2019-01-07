import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { tagName, layout } from '@ember-decorators/component';
// @ts-ignore: Ignore import of compiled template
import template from '../../templates/components/table-items/thead';
import Column from "opti-grid/objects/Column";
import { action } from '@ember-decorators/object';
import ArrayProxy from '@ember/array/proxy';
import {set} from "@ember/object";
import {IDidReorder} from "opti-grid/components/table-items/grid";
import ITableSettings from "opti-grid/objects/interfaces/ITableSettings";

@tagName('thead')
@layout(template)
export default class Thead extends Component {

    columns!: ArrayProxy<Column>;
    didReorder!: IDidReorder;
    tableSettings!: ITableSettings;
    isGrouping!: boolean;

    @computed()
    get expandTH(){
        return this.tableSettings.subGrid || this.isGrouping;
    }

    didRender() {
        this._super(...arguments);
        this.indexColumns();
    }

    indexColumns(){
        this.columns.forEach((column, index)=>{
            set(column, 'index', index);
        });
    }

    @action
    onReorder(onColumnIndex: number, fromColumnIndex: number){
        let fromColumn = this.columns.objectAt(fromColumnIndex) as Column;
        this.columns.removeAt(fromColumnIndex);
        this.columns.insertAt(onColumnIndex, fromColumn);
        this.didReorder();
        this.indexColumns();
        return true;

    }

};

export interface IOnReorder {
    (onColumnIndex: number, fromColumnIndex: number): void
}
