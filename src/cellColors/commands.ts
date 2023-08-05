// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as vscode from 'vscode';
import { getColorMetadata, updateColorMetadata } from './util/colorMetadataHelpers';

// Register our commands for run groups
export function registerCommands(context: vscode.ExtensionContext) {
    // Register add commands
    context.subscriptions.push(
        vscode.commands.registerCommand('vscode-notebook-colors.addColor', (args, colorValue: string) => {
            addToColor(colorValue, argNotebookCell(args));
        })
    );

    // Register remove color command
    context.subscriptions.push(
        vscode.commands.registerCommand('vscode-notebook-colors.removeColor', (args) => {
            removeFromColor(argNotebookCell(args));
        })
    );
}

// Find the current active notebook document and the current active cell in it
function getCurrentActiveCell(): vscode.NotebookCell | undefined {
    const activeNotebook = vscode.window.activeNotebookEditor;

    if (activeNotebook) {
        // || is ok here as 0 index is the same as the default value
        const selectedCellIndex = activeNotebook?.selections[0]?.start || 0;

        return activeNotebook.notebook.cellCount >= 1 ? activeNotebook.notebook.cellAt(selectedCellIndex) : undefined;
    }
}

export function updateContextKeys() {
    const activeNotebook = vscode.window.activeNotebookEditor;
    const selectedCellIndex = activeNotebook?.selections[0]?.start || 0;
    const selectedCell = activeNotebook?.notebook.cellAt(selectedCellIndex);

    if (selectedCell) {
        const currentColor = getColorMetadata(selectedCell);
        vscode.commands.executeCommand('setContext', 'notebookColors.selectedCellHasColor', !!currentColor);
    } else {
        vscode.commands.executeCommand('setContext', 'notebookColors.selectedCellHasColor', false);
    }
}

// Is the given argument a vscode NotebookCell?
function argNotebookCell(args: any): vscode.NotebookCell | undefined {
    // Check to see if we have a notebook cell for command context. Kinda ugly? Maybe a better way to do this.
    if (args && 'index' in args && 'kind' in args && 'notebook' in args && 'document' in args) {
        return args as vscode.NotebookCell;
    }
    return undefined;
}

// For the target cell, add it to the given run group
function addToColor(colorValue: string, notebookCell?: vscode.NotebookCell) {
    // If we were not passed in a cell, look for one
    if (!notebookCell) {
        notebookCell = getCurrentActiveCell();
        if (!notebookCell) {
            return;
        }
    }

    updateColorMetadata(notebookCell, colorValue);
    updateContextKeys();
}

function removeFromColor(notebookCell?: vscode.NotebookCell) {
    // If we were not passed in a cell, look for one
    if (!notebookCell) {
        notebookCell = getCurrentActiveCell();
        if (!notebookCell) {
            return;
        }
    }

    // Check if the cell has a color applied
    const currentColor = getColorMetadata(notebookCell);
    if (currentColor) {
        // Remove the color
        updateColorMetadata(notebookCell, '');
        updateContextKeys();
    }
}
