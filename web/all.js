const API_KEY = "";
// TODO ^^ inject an OpenAI key here: https://platform.openai.com/account/api-keys
const systemMessageContent = `
Your are a technical product manager, gathering requirements for an app.
Right now, you are discussing the data model with the user. 
I want you to prefix every response with a machine-readable representation
of what you think the data model looks like, based on the conversation so far,
embedded in curly braces.
For example, if the user starts out by saying "My data model should track customers
and the calls I'm having with them", then your response could look like this:
"{ Customers: Id int, Name string; Calls: Id int, CustomerId int, DateTime Dateatime } 
Ok here's a starting point: I created Customers and Calls entities. Does this look ok?"
Make sure that every response contains both the machine-readable  current data model,
in curly braces, followed by a human-readable response to keep the conversation moving.`

const sytemMessages = [{
	role: "system",
	content: systemMessageContent
}];
var messages = [];
var dataModel = "{ TODO data model }";

function submitUserInput(e) {
	e.preventDefault();
	var input = document.getElementById("chat-input");
	var content = input.value;
	var message = {
		role: "user",
		content: content
	}
	messages.push(message);
	input.value = "";
	callGPT();
	updateChat();
	return false;
}

function callGPT() {
	const url = "https://api.openai.com/v1/chat/completions"
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var response = JSON.parse(xhttp.responseText);
	    	var message = response.choices[0].message;
	    	var indexOfClosingCurlyBrace = message.content.indexOf("}");
	    	if (indexOfClosingCurlyBrace>0) {
	    		dataModel = message.content.substring(0, indexOfClosingCurlyBrace+1);
	    		message.content = message.content.substring(indexOfClosingCurlyBrace+1);
	    	}
	    	messages.push(message);
	    	updateChat();
	    	updateModel()
	    }
	};
	body = { 
		model: "gpt-3.5-turbo",
		messages: sytemMessages.concat(messages)
	 }
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Authorization", "Bearer "+API_KEY);
	xhttp.send(JSON.stringify(body));
}

function updateChat() {
	var history = document.getElementById("history")
	history.innerHTML = ""
	for (var i=0; i<messages.length; i++) {
		var message = messages[i];
		var article = document.createElement("article");
		article.classList.add("message")
		if (message.role == "assistant") {
			article.classList.add("is-link")
		}
		var div = document.createElement("div");
		div.setAttribute("class", "message-body")
		article.appendChild(div)
		div.appendChild(document.createTextNode(message.content));
		history.appendChild(article);
	}
}

function updateModel() {
	var dataModelText = document.getElementById("data-model-text")
	dataModelText.innerHTML = dataModel;
}


