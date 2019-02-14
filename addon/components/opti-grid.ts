import Component from '@ember/component';
import DS from 'ember-data';
// @ts-ignore: Ignore import of compiled template
import layout from '../templates/components/opti-grid';
import Column from "../objects/Column";
import { action } from '@ember-decorators/object';
import ArrayProxy from '@ember/array/proxy';
import ITableSettings from "opti-grid/objects/interfaces/ITableSettings";
import { computed } from '@ember-decorators/object';
// import SortTypes from "opti-grid/objects/SortTypes";
import { set } from "@ember/object";
import { assign } from '@ember/polyfills';
import {A} from "@ember/array";
import exportGrid from "opti-grid/utils/export-grid";
import {scheduleOnce, later} from "@ember/runloop";
import ExportTypes from "opti-grid/objects/ExportTypes";
import DomUtil from "opti-grid/utils/dom-util";
import Row from "opti-grid/objects/Row";
import {persistGridState, processColumns, removeStorage, saveOpenRows} from "opti-grid/utils/grid-state-storage";

/**
 * OptiGrid
 * this will be what is created
 * handles closure actions and merging settings
 */
export default class OptiGrid extends Component {

    layout = layout;
    columns!: ArrayProxy<Column>;
    records!: ArrayProxy<DS.Model>;
    rowGrouping!: ArrayProxy<Column>;
    onRowSelect!: IExposedRowSelect; // exposed action
    onRowContextMenu!: IExposedRowContextMenu; // exposed action
    onRoxExpanded!: IOnRowExpand; //exposed action
    onRowRendered!: IExposedOnRowRendered;
    renderAll = true;
    domUtil!: DomUtil;
    globalSearchString!: string;
    tableSettings!: ITableSettings;
    processedColumns!: ArrayProxy<Column>;

    init() {
        this.set('rowGrouping', ArrayProxy.create({ content: A()}));
        if (this.records.length > 100) {
            this.set('renderAll', false);
        }
        set(this, 'processedColumns', processColumns(this.columns, this.tableSettings.localStorageName));
        return super.init();
    }

    didInsertElement(){
        this._super(...arguments);
        let domUtil = new DomUtil(this.$().find('table'));
        domUtil.initiateStickyHeader(this.tableSettings.level);
        domUtil.activateResizeColumns(()=>{ this.send('onUserChangeState') }, this);
        this.set('domUtil', domUtil);
    }

    @computed('tableSettings')
    get mergedSettings() {
        if (!this.tableSettings.level) {
            this.tableSettings.level = 0;
        }
        return assign(new TableDefaults(), this.tableSettings);
    }

    @action
    resetColumnState(){
        this.domUtil.runOnManipulation(()=>{ this.send('onUserChangeState')}, this);
        removeStorage(this.tableSettings.localStorageName);
        this.set('processedColumns', this.refreshColumns());
    }

    refreshColumns(){
        return this.columns.map((oldColumn)=>{
            return new Column(oldColumn.name, oldColumn.label, oldColumn.settings);
        });
    }

    @action
    exportGrid(exportType: ExportTypes){
        this.set('renderAll', true);
        scheduleOnce('afterRender', this, 'runExport', exportType)
    }

    @action
    onUserChangeState(){
        persistGridState(this.processedColumns, this.$(), this.tableSettings.localStorageName);
    }

    @action
    afterRowsSelected(rows: Row[], contextMenu: boolean){
        if (this.onRowSelect) {
            this.onRowSelect(rows);
        }
        if (this.onRowContextMenu && contextMenu) {
            this.onRowContextMenu(rows[0]);
        }
    }

    @action
    onRowExpand(row: Row){
        saveOpenRows(row, this.tableSettings.localStorageName);
        if (this.onRoxExpanded) {
            this.onRoxExpanded(row);
        }
    }

    runExport(exportType: ExportTypes){

        let tableId = this.$().find('table').attr('id');
        if (tableId) {
            // pop exportgrid out of stack to ensure all records are rendered
            later(()=>{
                exportGrid(tableId, exportType, this.tableSettings.gridLabel).then(() => {
                    this.set('renderAll', false);
                });
            }, 1)
        }
    }
};

class TableDefaults implements ITableSettings{
    columnFilter = true;
    header = true;
    exporting = true;
    globalSearch = true;
    rowOrdering = true;
    useDomUtil = false;
}

export interface onUserChangeState {
    (): void;
}

export interface IAfterRowsSelected {
    (selectedRows: Row[], contextMenu: boolean): Row[];
}

export interface IOnRowExpand {
    (selectedRow: Row) : Row;
}

export interface IExposedRowSelect {
    (selectedRows: Row[]): Row[];
}

export interface IExposedRowContextMenu {
    (selectedRow: Row): Row[];
}

export interface IExposedOnRowRendered {
    (renderedRow: Row): Row[];
}

