import SortTypes from "opti-grid/objects/enums/SortTypes";
import Column from "opti-grid/objects/Column";
import ArrayProxy from "@ember/array/proxy";
import {A} from "@ember/array";
import Row from "opti-grid/objects/Row";

/*
 * functionality for settings gridState ( columnWidth, columnOrder, filtering ) to a LocalStorage,
 *
 * openRows is set to a SessionStorage
 *
 */

export function retrievePersistedGridState(storageName?: string) {
    if (storageName) {
        return parseStore(storageName);
    }
    return null;
}

function parseStore(storageName: string, storageType = StorageType.LOCAL) {
    let storage = storageType === StorageType.LOCAL ? localStorage.getItem(storageName) : sessionStorage.getItem(storageName);
    if (storage) {
        try {
            return JSON.parse(storage);
        } catch (e) {
            console.error(e)
        }
    }
}


function buildColumnState( columns: Column[] | ArrayProxy<Column>, $grid: JQuery) {
    return columns.map((column)=>{
        let hidden = column.settings.hidden || false;
        let columnState: IColumnState = { name: column.name, hidden };
        if (column.searchValue) {
            columnState.searchValue = column.searchValue
        }
        if (column.sorting) {
            columnState.sorting = column.sorting
        }
        let $th = $grid.find(`.opti-grid-column-${column.className}`);
        if ($th.length > 0 && column.settings.resizable) {
            columnState.width = $th.width()
        }
        return columnState;
    });
}

export function removeStorage(storageName?: string, storageType = StorageType.LOCAL) {
    if (storageName) {
        if (storageType === StorageType.SESSION) {
            sessionStorage.removeItem(storageName);
        } else if(storageType === StorageType.LOCAL) {
            localStorage.removeItem(storageName);
        }

    }
}

function persistStorage(storageType: StorageType, value: any, storageName?: string) {
    if (storageName) {
        try {
            let formattedValue = JSON.stringify(value);
            if (storageType === StorageType.LOCAL) {
                localStorage.setItem(storageName, formattedValue)
            } else if(storageType === StorageType.SESSION){
                sessionStorage.setItem(storageName, formattedValue)
            }
        } catch (e) {
            console.error(e)
        }
    }
}

export function persistGridState(columns: Column[] | ArrayProxy<Column>, $grid: JQuery, storageName?: string) {
    if (storageName) {
        persistStorage(StorageType.LOCAL, buildColumnState(columns, $grid), storageName);
    }
}

export function processColumns(columns: ArrayProxy<Column>, storageName?: string) {
    let columnState = retrievePersistedGridState(storageName);
    if (columnState) {
        let newColumns: Column[] = [];
        columnState.forEach((colState: IColumnState)=>{
            let foundColumn = columns.findBy('name', colState.name) as Column;
            if (foundColumn) {
                let newColumn = new Column(foundColumn.name, foundColumn.label, foundColumn.settings);
                newColumn.settings.width = colState.width ? colState.width : foundColumn.settings.width;
                if (colState.searchValue) {
                    newColumn.searchValue = colState.searchValue
                }
                if (colState.sorting) {
                    newColumn.sorting = colState.sorting
                }
                newColumns.push(newColumn);
            }
        });


        if (newColumns.length !== columns.length) {
            removeStorage(storageName);
            console.log('column added, resetting storage');
        } else {
            return ArrayProxy.create({content: A(newColumns)}) as ArrayProxy<Column>;
        }

    }
    return columns;
}

export function openRows(rows: ArrayProxy<Row>, storageName?: string) {
    if (storageName) {
        let storageKey = getRowsStorageName(storageName);
        let content = parseStore(storageKey, StorageType.SESSION);
        if (content) {
            content.forEach((rowId: number)=>{
                let openRow = rows.findBy('record.id', `${rowId}`) as Row;
                if (openRow) {
                    openRow.set('isExpanded', true);
                }
            });
        }
    }
}

export function removeRow(recordId: number, storageName?: string) {
    if (storageName) {
        let storageKey = getRowsStorageName(storageName);
        let content = parseStore(storageKey, StorageType.SESSION);
        if (content) {
            let rowIds = ArrayProxy.create({ content });
            rowIds.removeObject(recordId);
            persistStorage(StorageType.SESSION, rowIds.get('content'), storageKey)
        }
    }
}

function getRowsStorageName(storageName: string) {
    return storageName + "-openRows";
}

export function saveOpenRows(row: Row, storageName?: string) {
    if (storageName) {
        let storageKey = getRowsStorageName(storageName);
        let rowStorage = sessionStorage.getItem(storageKey);
        if (!rowStorage) {
            sessionStorage.setItem(storageKey, `[${row.record.id}]`);
        } else {
            let content = parseStore(storageKey, StorageType.SESSION);
            let rowIds = ArrayProxy.create({ content });
            rowIds.addObject(parseInt(row.record.id));
            persistStorage(StorageType.SESSION, rowIds.get('content'), storageKey);
        }
    }
}

enum StorageType {
    LOCAL, SESSION
}


export interface IColumnState {
    width?: number,
        hidden?: boolean,
        searchValue?: string | number,
        sorting?: SortTypes | boolean,
        name: string
}
