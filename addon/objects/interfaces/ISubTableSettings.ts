import ITableSettings from "opti-grid/objects/interfaces/ITableSettings";
import ArrayProxy from "@ember/array/proxy";
import Column from "opti-grid/objects/Column";

export interface ISubTableSettings extends ITableSettings {

    callBack(record: any) : Promise<any> | any,
    colModel: ArrayProxy<Column>

}
