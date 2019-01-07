import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/sub-grid';
import { tagName, layout, classNames } from '@ember-decorators/component';
import {ISubTableSettings} from "opti-grid/objects/interfaces/ISubTableSettings";
import Row from "opti-grid/objects/Row";
import { observes } from '@ember-decorators/object';
@tagName('tr')
@layout(template)
@classNames('sub-grid-container')
export default class SubGrid extends Component {

    parentColumnCount!: number;
    tableSettings!: ISubTableSettings;
    row!: Row;
    data!: any;

    @observes('row.record.@each')
    recordChange(){
        this.setData();
    }

    init() {
        this.setData();
        return super.init();
    }

    setData(){
        if (this.tableSettings) {
            let response = this.tableSettings.callBack(this.row.record);
            new Promise(function (resolve) {
                resolve(response)
            }).then((payload: any) => {
                this.set('data', payload);
            });
        }


    }

}
