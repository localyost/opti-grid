import Column from "opti-grid/objects/Column";
import ArrayProxy from "@ember/array/proxy";
import {isEmpty} from "@ember/utils";
import {Formatters} from "opti-grid/objects/Formatters";
import moment from 'moment';
import SearchOperators from "opti-grid/objects/SearchOperators";
import DS from 'ember-data';
export default class ColumnFilter {


    public filter(columns: ArrayProxy<Column>, records: ArrayProxy<DS.Model>, type: Formatters ){

        let searchableColumns = columns.filterBy('settings.formatter', type).filterBy('searchValue');
        let searchingColumns = ArrayProxy.create({content: searchableColumns});

        if (!isEmpty(searchingColumns)) {

            let filter: Function;

            switch (type) {
                case Formatters.DATE:
                    filter = dateColumnFilter;
                    break;
                case Formatters.NUMBER:
                    // if no search operand is set, number search will use the string filter
                    filter = searchingColumns.isAny('settings.searchOperator') ? numberColumnFilter : stringColumnFilter;
                    break;
                default:
                    filter = stringColumnFilter
            }


            // @ts-ignore
            let filters = ArrayProxy.create({content: []});
            searchingColumns.forEach((searchingColumn, index)=>{
                let rowsToFilters = isEmpty(filters) ? records : filters.objectAt(index - 1);
                filters.addObject(filter(rowsToFilters, searchingColumn));
            });
            return filters.get('lastObject');
        } else {
            return records;
        }
    }
}

function stringColumnFilter(recordsToFilter: ArrayProxy<DS.Model>, column: Column) {
    return recordsToFilter.filter((record)=>{
        let cellValue = '' + record.get(column.name as any);
        cellValue = cellValue.toUpperCase();
        return -1 !== cellValue.indexOf(column.searchValue.toString().toUpperCase());
    });
}

function dateColumnFilter(recordsToFilters: ArrayProxy<DS.Model>, column: Column) {
    let selectedTime = moment(column.searchValue);
    return recordsToFilters.filter((record)=>{

        let value = record.get(column.name as any) as number;
        if ( value > 0) {
            // is same day
            let recordDate = moment(value).startOf('day');
            return 0 == recordDate.diff(selectedTime);
        }
        return false;
    });
}

function numberColumnFilter(recordsToFilters: ArrayProxy<DS.Model>, column: Column) {
    return recordsToFilters.filter((record)=>{
        let cellValue = record.get(column.name as any);
        if (cellValue) {
            return calculateWithOperand(cellValue, column.settings.searchOperator, parseInt(column.searchValue as string))
        }
        return false;
    });
}


function calculateWithOperand(value1: number, operator: SearchOperators | undefined, value2: number) {
    switch (operator) {
        case SearchOperators.EQ:
            return value1 === value2;
        case SearchOperators.NEQ:
            return value1 !== value1;
        case SearchOperators.GT:
            return value1 > value2;
        case SearchOperators.GTET:
            return value1 >= value1;
        case SearchOperators.LT:
            return value1 < value2;
        case SearchOperators.LTET:
            return value1 <= value2;
        default:
            return value1 === value2;
    }
}
