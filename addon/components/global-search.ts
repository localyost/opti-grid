import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/global-search';
import { layout, classNames } from '@ember-decorators/component';
@layout(template)
@classNames('ui mini input')
export default class GlobalSearch extends Component {

};
