import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../../templates/components/table-items/row-grouping-body';
import {layout, tagName} from '@ember-decorators/component';
import {action, computed} from '@ember-decorators/object';
import Column from "opti-grid/objects/Column";
import DS from "ember-data";
import ArrayProxy from '@ember/array/proxy';
import {isEmpty} from "@ember/utils";
import Formatters from "opti-grid/objects/enums/Formatters";
import Row from "opti-grid/objects/Row";
import { A } from '@ember/array';
import selectRows from "opti-grid/utils/row-select-util";
import {IAfterRowsSelected} from "opti-grid/components/opti-grid";

@tagName('tbody')
@layout(template)
/**
 * a different <tbody> tag for when row grouping is activated
 */
export default class RowGroupingBody extends Component {

    columns!: ArrayProxy<Column>;
    rows!: ArrayProxy<Row>;
    rowGrouping!: ArrayProxy<Column>;
    afterRowsSelected!: IAfterRowsSelected;

    @computed('rowGrouping.[]')
    get groupingRows() : ArrayProxy<GroupingRow> {
        return this.createGroupings();
    }

    @action
    expandLevel(ofRow: GroupingRow){
        let insertIndex = this.groupingRows.indexOf(ofRow) + 1 ;
        // has a next grouping level
        if (ofRow.children) {
            ofRow.children.forEach((row: GroupingRow, index: number)=>{
                this.groupingRows.insertAt(insertIndex + index , row);
            });
        } else {
            // display records
            ofRow.set('isFinal', true);
            ofRow.records.forEach((record, index)=>{
                let row = GroupingRow.create({record});
                ofRow.addChild(row);
                this.groupingRows.insertAt(insertIndex + index, row);
            });
        }

    }

    @action
    collapseLevel(ofRow: GroupingRow){
        this.recursiveChildRemoval(ofRow);
    };

    @action
    onRowSelected(row: Row, event: MouseEvent, rightClick: boolean){
        let selectedRows = selectRows(row, this.groupingRows, event, rightClick);
        if (!isEmpty(selectedRows)) {
            this.afterRowsSelected(selectedRows, rightClick);
        }
    }

    recursiveChildRemoval(row: GroupingRow){
        if (!isEmpty(row.children)) {
            row.children.forEach((child: GroupingRow)=>{
                let removeIndex = this.groupingRows.indexOf(child);
                if (removeIndex > -1) {
                    this.groupingRows.removeAt(removeIndex);
                    this.recursiveChildRemoval(child);
                }

            });
        }
    }

    //todo for the love of god refactor this
    createGroupings(){
        // @ts-ignore
        let grouping = ArrayProxy.create({ content: []}) as ArrayProxy<GroupingRow>;
        let currentGroupingSet: ArrayProxy<GroupingRow>;
        // firstLevel
        this.rowGrouping.forEach((column, level)=>{
            if (isEmpty(grouping)) {
                // @ts-ignore
                currentGroupingSet = ArrayProxy.create({ content: []});
                this.rows.forEach((row)=>{
                    let record = row.record;
                    let key = record.get(column.name as any);
                    if (key) {
                        let find = grouping.findBy('key', key);
                        if (!find) {
                            let group1 = GroupingRow.create({level, key});
                            group1.set('formatter', column.settings.formatter);
                            group1.set('formatterOptions', column.settings.formatterOptions);
                            group1.addRecord(record);
                            grouping.addObject(group1);
                            currentGroupingSet.addObject(group1);
                        } else {
                            find.addRecord(record);
                        }
                    }
                });
            } else {
                let previousGrouping = currentGroupingSet.filterBy('level', level-1 ); // here is the problem
                // go through previousGrouping and create a childGrouping
                previousGrouping.forEach((parentGroup)=>{
                    parentGroup.records.forEach((parentRecord)=>{
                        let key = parentRecord.get(column.name as any);
                        let find = parentGroup.children ? parentGroup.children.findBy('key', key) : null;
                        if (key) {
                            if (!find) {
                                let childGroup = GroupingRow.create({level, key});
                                childGroup.addRecord(parentRecord);
                                childGroup.set('formatter', column.settings.formatter);
                                childGroup.set('formatterOptions', column.settings.formatterOptions);
                                parentGroup.addChild(childGroup);
                                currentGroupingSet.addObject(childGroup);
                            } else {
                                find.addRecord(parentRecord);
                            }
                        }
                    });
                });
            }
        });

        return grouping;
    }
};

export class GroupingRow extends Row {
    key!: string | number;
    level!: number;
    formatter!: Formatters;
    formatterOptions?: any;
    children!: ArrayProxy<GroupingRow>;
    records!: ArrayProxy<DS.Model>;
    isFinal!: boolean;

    constructor(args?: IGroupingRowParams){
        super(...arguments);
        if (args) {
            this.set('key', args.key);
            this.set('level', args.level);
            if (!args.records) {
                // @ts-ignore
                this.set('records', ArrayProxy.create({content: []}))
            }
        }
    }

    addRecord(record: DS.Model){
        this.records.addObject(record);
    }

    addChild(child: GroupingRow){
        if (!this.children) {
            this.set('children', ArrayProxy.create({content: A([child])}))
        } else {
            this.children.addObject(child)
        }
    }
}

interface IGroupingRowParams  {
    key: string,
    // record: DS.Model,
    records?: ArrayProxy<DS.Model>,
    level?: number,
    formatter?: Formatters,
    formatterOptions?: any,
    children?: ArrayProxy<GroupingRow>,
    isRecord?: boolean
}

