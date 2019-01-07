import DS from "ember-data";
import Column from "../Column";
import ArrayProxy from '@ember/array/proxy';
export default interface ITableData {

    records: ArrayProxy<DS.Model>;
    columns: ArrayProxy<Column>;
}
