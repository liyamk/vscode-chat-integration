// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as chatService from "./chatService";


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// this scope executed once per extension activation

	// The command has been defined in the package.json file
	// implementation for command goes under 'registerCommand'
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('chat-gpt-integration.quickChat', async () => {
		// The code you place here will be executed every time your command is executed

		const userResponse: string = await vscode.window.showInputBox({
			placeHolder: 'Type in your question'
		}) || ""; 

		// TODO handle empty string
		try {
			const chatRepsonse = await chatService.fetchChatResponse(userResponse);
			console.log(userResponse);
			vscode.window.showInformationMessage(chatRepsonse.choices[0]?.message.content);
		}
		catch(err){
			const responseError: chatService.ResponseError = (err as chatService.ResponseError);
			console.error(responseError.response);
			// customize messages based on status number : https://platform.openai.com/docs/guides/error-codes/api-errors
			vscode.window.showErrorMessage(responseError.message);
		}
	});

	
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
