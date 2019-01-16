opti-grid
==============================================================================

[Examples](https://calm-fjord-91195.herokuapp.com/) -- ( Its a free Heroku Deployment so it takes a second to load )

Prototype for a Table Widget like Nebulas xviewer solely using Ember. Still a work in progress.

TODO before production ready

* write tests if we end up using this
* clean up leaky properties on Component tear downs
* Component for selecting and removing Columns

Installation
------------------------------------------------------------------------------

not yet published to nexus

Usage
------------------------------------------------------------------------------

settings

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
