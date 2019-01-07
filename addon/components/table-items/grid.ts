import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../../templates/components/table-items/grid';
import {action, computed} from '@ember-decorators/object';
import {layout, tagName, className} from '@ember-decorators/component';
import ArrayProxy from '@ember/array/proxy';
import {debounce} from '@ember/runloop';
import Column from "opti-grid/objects/Column";
import { sort } from '@ember-decorators/object/computed';
import DS from "ember-data";
import ITableSettings from "opti-grid/objects/interfaces/ITableSettings";
import ColumnFilter from "opti-grid/utils/search/ColumnFilter";
import globalTableSearch from "opti-grid/utils/search/global-table-search";
import {Formatters} from "opti-grid/objects/Formatters";
import {A} from '@ember/array';
import Row from "opti-grid/objects/Row";
import {set} from "@ember/object";
import {SortTypes} from "opti-grid/objects/SortTypes";
import {IAfterRowsSelected, onUserChangeState} from "opti-grid/components/opti-grid";
import DomUtil from "opti-grid/utils/dom-util";
import selectRows from "opti-grid/utils/row-select-util";
import {isEmpty} from "@ember/utils";
import {openRows} from "opti-grid/utils/grid-state-storage";
import OptiGridDomUtil from "opti-grid/utils/opti-grid-dom-util";

@tagName('table')
@layout(template)
export default class Table extends Component {

    columns!: ArrayProxy<Column>;
    records!: ArrayProxy<DS.Model>;
    globalSearchString!: string;
    // false = use vertical-collection
    renderAll!: boolean;
    afterRowsSelected!: IAfterRowsSelected;
    tableSettings!: ITableSettings;
    onUserChangeState!: onUserChangeState;
    columnFilter!: ColumnFilter;
    domUtil!: DomUtil;
    firstSort!: string[];

    @className('bold-rows', 'normal-rows') boldRows = this.tableSettings.boldRows || false;
    @className('white-background') whiteBg = this.tableSettings.noBackgroundColor || false;
    @className('pointer-rows') pointerRows = this.tableSettings.pointerRows || false;

    init() {
        // set sorting
        this.set('firstSort', []);
        let firstSortingColumn = this.columns.filterBy('sorting').get('firstObject');
        if (firstSortingColumn) {
            this.setSorting(firstSortingColumn);
        }
        set(this, 'columnFilter', new ColumnFilter());
        return super.init();
    }

    didInsertElement(){
        if (this.tableSettings.useDomUtil) {
            new OptiGridDomUtil(this); //FIXME <- causes Memory leaks
        }
        this._super(...arguments);
    }

    // step 1 sort records
    @sort('records', 'firstSort') sortedRecords!: ArrayProxy<DS.Model>;

    // step 2 filter rows
    @computed('globalSearchString', 'columns.@each.searchValue', 'sortedRecords.[]')
    get filteredRows(){
        let filter = globalTableSearch(this.globalSearchString, this.sortedRecords, this.columns) as ArrayProxy<DS.Model>;
        filter = this.columnFilter.filter(this.columns, filter, Formatters.DEFAULT);
        filter = this.columnFilter.filter(this.columns, filter, Formatters.DATE);
        filter = this.columnFilter.filter(this.columns, filter, Formatters.NUMBER);
        return filter;
    }

    // step 3 create Row Objects, final step
    @computed('filteredRows.[]')
    get rows(){
        let rows = this.filteredRows.map((record)=>{
            return Row.create({record}) as Row;
        });
        let processedRows = ArrayProxy.create({ content: A(rows)}) as ArrayProxy<Row>;
        if (this.tableSettings.localStorageName) {
            openRows(processedRows, this.tableSettings.localStorageName);
        }
        return processedRows;
    }

    setSorting(column: Column){
        if (column.sorting) {
            let key = column.name;
            let sort = column.sorting;
            this.set('firstSort', [`${key}:${sort}`]);
        } else {
            this.set('firstSort', []);
        }
    }

    @action
    onColumnSearch(){
        debounce(this, 'onUserChangeState', 1000);
    }

    @action
    didSort(column: Column){
        // reset all columns except the one being sorted
        //todo multi level sorting
        this.columns.filterBy('sorting').rejectBy('name', column.name).forEach((_col)=>{
            set(_col, 'sorting', false);
        });
        if (!column.sorting) {
            set(column, 'sorting', SortTypes.DESC)
        } else if(column.sorting === SortTypes.DESC){
            set(column, 'sorting', SortTypes.ASC)
        } else {
            set(column, 'sorting', false)
        }

        this.setSorting(column);
        this.onUserChangeState();

    }

    @action
    onRowSelected(row: Row, event: MouseEvent, rightClick: boolean){
        let selectedRows = selectRows(row, this.rows, event, rightClick);
        if (!isEmpty(selectedRows)) {
            this.afterRowsSelected(selectedRows, rightClick);
        }
    }

    @action
    didReorder(){
        this.onUserChangeState();
    }

    @action
    willReorder(){
        this.domUtil.runOnManipulation(this.onUserChangeState, this);
    }
};

export interface IDidSort {
    (column: Column): void;
}

export interface IDidReorder {
    (): void;
}
export interface IWillReorder {
    (): void;
}

export interface IOnColumnSearch {
    (column: Column): void;
}

export interface IDidSelectRow {
    (row: Row, event: MouseEvent | undefined, rightClick: boolean): void;
}
