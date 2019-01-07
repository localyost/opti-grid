import {Formatters} from "opti-grid/objects/Formatters";
import {Editables} from "opti-grid/objects/Editables";
import {ColumnSearchTypes} from "opti-grid/objects/ColumnSearchTypes";
import {SearchOperands} from "opti-grid/objects/SearchOperands";
import {SortTypes} from "opti-grid/objects/SortTypes";
import { camelize } from '@ember/string';
import {set} from "@ember/object";
export default class Column {

    name: string;
    className: string;
    label: boolean | string; // if false, is has no label
    isGrouping!: boolean;
    searchValue!: string | number;
    sorting!: SortTypes | boolean;
    settings = {
        draggable: true,
        columnSearch: true,
        formatter: Formatters.DEFAULT,
        columnSearchType: ColumnSearchTypes.STRING,
        sortable: true,
        resizable: true
        // searchOperand: SearchOperands.GT
    } as IColSettings;
    index!: number;

    constructor(name: string, label: boolean | string, settings?: IColSettings ){
        this.name = name;
        this.className = camelize(name);
        this.label = label;
        if (settings){
            set(this, "settings", Object.assign(this.settings, settings))
        }
    }

}

export interface IColSettings {
    columnSearchType?: ColumnSearchTypes
    columnSearch?: boolean,
    hidden?: boolean,
    width?: number,
    alignRight?: boolean;
    searchOperand?: SearchOperands,
    resizable?: boolean;
    sortable?: boolean
    draggable?: boolean,
    formatter?: Formatters | string,
    formatterOptions?: any,
    editable?: {
        type: Editables | string,
        options?: any,
        callBack?: Function | undefined
    }
}
