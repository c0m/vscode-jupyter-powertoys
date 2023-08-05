// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { registerDocuments } from './documents';

export function activateCellColors(context: vscode.ExtensionContext) {
	// Register all of our commands
	registerCommands(context);

    // Register document handling
    registerDocuments(context);
}
