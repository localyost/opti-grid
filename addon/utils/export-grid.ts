import {ExportTypes} from "opti-grid/objects/ExportTypes";
import $ from 'jquery';
export default function exportGrid(gridId: string | undefined, exportType: ExportTypes, gridLabel?: string) {
    return new Promise(function(resolve) {
        let filename = gridLabel ? `DispoClient-${gridLabel}-export` :  `DispoClient-export`;
        if (gridId) {
            let gridNode = document.getElementById(gridId);
            if (exportType !== ExportTypes.HTML) {
                // @ts-ignore
                let tableExport = TableExport(gridNode, {
                    headers: true,                              // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
                    // footers: true,                              // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
                    formats: ['csv', 'txt', 'xls'],                    // (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
                    filename,                             // (id, String), filename for the downloaded file, (default: 'id')
                    bootstrap: false,                           // (Boolean), style buttons using bootstrap, (default: true)
                    exportButtons: false,                       // (Boolean), automatically generate the built-in export buttons for each of the specified formats (default: true)
                    // position: 'bottom',                         // (top, bottom), position of the caption element relative to table, (default: 'bottom')
                    ignoreRows: null,                           // (Number, Number[]), row indices to exclude from the exported file(s) (default: null)
                    ignoreCols: null,                           // (Number, Number[]), column indices to exclude from the exported file(s) (default: null)
                    trimWhitespace: true                        // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
                });
                let exportData = tableExport.getExportData()[gridId][exportType];
                tableExport.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
            } else {
                if (gridNode) {
                    let tab = window.open('','_blank', 'toolbar=no') as Window;
                    $(tab.document.body).replaceWith($(gridNode).clone());
                }

            }

        }
        resolve();
    });

}
/*
 */
