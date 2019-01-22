Opti-Grid --Still a work in progress
==============================================================================

[Examples](https://calm-fjord-91195.herokuapp.com/) -- ( Its a free Heroku Deployment so it takes a second to load )

Prototype for a Table Widget like Nebulas xviewer solely using Ember.

TODO before production ready

* write a test suite.
* clean up leaky properties on Component tear downs.
* Component for selecting and removing Columns.
* Polish up Inline Editing.
* [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) out the code.

Problems
------------------------------------------------------------------------------
### Memory Leakage
The `OptiGrid` Component acts soley as a Wrapper for `Grid` (HTMLTableElement). There are a lot of Use Cases for accessing `OptiGrid` over the DOM. This is currently handled in the `OptiGridDomUtil` which adds OptiGrid's State to the HTMLTableElement. I'm not sure if this is a good Idea. As of now Profiling the Demo seems to indicate a slight memory leak but I still need a write a solid test-suite to confirm what is wrong.

### Not Framework Agnostic
This was written in Ember JS but Ideally it would be distributed as a [WebComponent](https://developer.mozilla.org/en-US/docs/Web/Web_Components). Once stable, I would like to see about repackaging as a custom element. 

### TD needs to adhere better to Ember's component lifecycle or be replaced
Initally I made the mistake of trying to display a `TD`'s value with a `computedProperty` which is created on `Component.didInsertElement`. This proved to be counter productive to I was trying to achieve with MVVM. I began implementing `Ember.Helper` which handles Data-Binding flawlessly. Maybe I should scrap the whole `TD` Component and only use helpers? 

### Inline Editing needs a solid Workflow
I'm still on the fench about how to handle inline Editing. Subclasses of `AbstractEditable` need to be more uniform in how they handle updating Records. I would like to give the Host App full control over what happens when `onFinishEdit` is called. I think providing `IColSettings.editable` with a `callBack` is the best option.

Usage
------------------------------------------------------------------------------

### TableSettings

```typescript
 export default interface ITableSettings {
     rowOrdering?: boolean;       // whether rows can be grouped
     exporting?: boolean;         // export grid to a file type @see ExportTypes
     header?: boolean;            // the toolbar with globalSearch, label, export ect.
     localStorageName?: string;   // needed if gridState should be saved
     columnFilter?: boolean;      // filter fields for individual columns
     subGrid?: ISubTableSettings; // has a Subgrid, will create an ExpandTD
     maxHeight?: number | string; // maxHeight default 400px
     boldRows?: boolean;          // rows have bold font
     columnSorting?: boolean;     // completely block sorting columns, not overridden when Column.settings.sortable = true
     pointerRows?: boolean;       // show a pointer when hovering over row
     gridLabel?: string;          // the name of the grid
     noBackgroundColor?: boolean; // do not use standard Coloring, just white
     level?: number               // the level of grid exp. 0 = mainGrid, 1 = firstSubGrid, 2 = secondSubGrid
     globalSearch?: boolean       // globalSearch field
     useDomUtil?: boolean         // whether the external DomUtil should be used, default off to save performance
 }

```
### Records

Records needs to be an enumerable of any type. Currently `DS.Model` is supported but a `Pojo` should work as long as it has an id property

```typescript
declare type Records = DS.AdapterPopulatedRecordArray<DS.Model> | EmberArray<DS.Model> | DS.Model[];
```

### Columns

Columns is an enumerable of type `Column`. The `IColSettings` allows for setting certain properties on a `Column`

```typescript 
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
```

### Put it all together

```handlebars
{{opti-grid 
    records=model.records 
    columns=columns
    tableSettings=tableSettings
}}
```

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd opti-grid`
* `npm install`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
