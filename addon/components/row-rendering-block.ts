import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/row-rendering-block';
import { tagName, layout } from '@ember-decorators/component';
import DS from 'ember-data';
import ArrayProxy from "@ember/array/proxy";
import Column from "opti-grid/objects/Column";
import Row from "opti-grid/objects/Row";
/**
 * just a rendering block for displaying record rows
 */
@tagName('')
@layout(template)
export default class RowRenderingBlock extends Component {

    row!: Row;
    @alias('row.record') record!: DS.Model;
    columns!: ArrayProxy<Column>;

};
