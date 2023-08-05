// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as vscode from 'vscode';

export function getColorMetadata(cell: vscode.NotebookCell): string {
    return cell.metadata?.custom?.colorValue || '';
}

// Function to update a cell's color metadata
export function updateColorMetadata(cell: vscode.NotebookCell, newColorValue: string) {
    const newMetadata = { ...(cell.metadata || {}), custom: { ...cell.metadata.custom, colorValue: newColorValue }};
    const wsEdit = new vscode.WorkspaceEdit();
    const notebookEdit = vscode.NotebookEdit.updateCellMetadata(cell.index, newMetadata);
    wsEdit.set(cell.notebook.uri, [notebookEdit]);
    vscode.workspace.applyEdit(wsEdit);
}
