import {ISubTableSettings} from "opti-grid/objects/interfaces/ISubTableSettings";

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
