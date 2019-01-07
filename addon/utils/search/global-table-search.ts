import ArrayProxy from "@ember/array/proxy";
import Column from "../../objects/Column";
// import DS from 'ember-data';
import {isPresent} from "@ember/utils";
export default function globalTableSearch(searchString: string, records: ArrayProxy<any>, columns: ArrayProxy<Column>) {

    if (isPresent(searchString)) {
        return  records.filter((record)=>{
            return columns.any((filterFor)=>{
                let cellValue = '' + record.get(filterFor.name as any);
                cellValue = cellValue.toUpperCase();
                return -1 !== cellValue.indexOf(searchString.toUpperCase());
            })
        });
    }

    return records;


}
