// @ts-ignore
import { htmlSafe } from '@ember/template';
// @ts-ignore: Ignore import of compiled template
import template from '../../templates/components/table-items/row-grouping-tr';
import ArrayProxy from '@ember/array/proxy';
import { layout } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Column from "opti-grid/objects/Column";
import { action } from '@ember-decorators/object';
import { GroupingRow } from "opti-grid/components/table-items/row-grouping-body";
import TR from './tr';
import Row from "opti-grid/objects/Row";
import ITableSettings from "opti-grid/objects/interfaces/ITableSettings";
@layout(template)
export default class TableItemsRowGroupingTr extends TR {

    isOpen = false;
    columns!: ArrayProxy<Column>;
    tableSettings!: ITableSettings;
    row!: GroupingRow | Row;
    index!: number;
    selectable = this.isRecord;

    @computed('row')
    get isRecord(){
        return this.row.record || false;
    }

    @computed()
    get colSpan(){
        let length = this.columns.length as number;
        if (this.tableSettings.subGrid) {
            return length + 1
        }
        return length - 1;
    }

    @computed('row')
    get tdPadding(){
        if (!this.isRecord) {
            let row = this.row as GroupingRow;
            let padding = row.level * 10;
            return htmlSafe(`padding-left: ${padding}px !important;`)
        }
        return '';
    }

    @action
    onExpandLevel(){
        this.toggleProperty('isOpen');
        // @ts-ignore
        this.attrs.onExpandLevel(this.row)
    }

    @action
    collapseLevel(){
        this.toggleProperty('isOpen');
        // @ts-ignore
        this.attrs.onCollapseLevel(this.row, this.index)
    }

};
