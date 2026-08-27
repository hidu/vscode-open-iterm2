"use strict";
import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("extension.our-terminal.open", (e: vscode.Uri) => {
    let uri = e;

    if (!uri) {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        uri = editor.document.uri;
      }
    }

    if (!uri) {
      vscode.window.showWarningMessage("No file or folder selected.");
      return;
    }

    const fsPath = uri.fsPath;
    let dirPath = fsPath;

    try {
      const stats = fs.statSync(fsPath);

      if (stats.isFile()) {
        dirPath = path.dirname(fsPath);
      }
    } catch {
      vscode.window.showWarningMessage("Unable to determine the directory.");
      return;
    }

    if (process.platform === "darwin") {
      const scriptPath = path.join(__dirname, "../../res/open-item2.scpt");
      spawn("osascript", [scriptPath, "cd", `"${dirPath}"`]).unref();
    } else if (process.platform === "win32") {
      // Windows Terminal
      spawn("wt.exe", ["-d", dirPath], {
        detached: true,
        stdio: "ignore",
      }).unref();
    } else {
      vscode.commands.executeCommand("workbench.action.terminal.openNativeConsole", e);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
