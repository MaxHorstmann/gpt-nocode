const API_KEY = "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";
// TODO ^^ inject an OpenAI key here: https://platform.openai.com/account/api-keys
const systemMessageContent = `
Your are a technical product manager, gathering requirements for an app.
Right now, you are discussing the data model with the user. 
I want you to prefix every response with a machine-readable representation
of what you think the data model looks like, based on the conversation so far,
as a JSON array, followed by ###. Each object in the array has two properties, "Name" and "Attributes".
"Attributes" is itself an array of strings. 

Make sure that every response always begins with the machine-readable data model as a JSON array, 
followed by ###, followed by a human-readable response to keep the conversation moving.

Make sure your response never begins with anything human-readable. The first part of
your response must always be the JSON array, followed by ###. Only after that, include
anything human-readable.

Make sure the JSON array is not embedded in an object. So your response should always start with [.
`



const sytemMessages = [{
	role: "system",
	content: systemMessageContent
}];
var messages = [];
var dataModelRaw = "[]";

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
	    	console.log(message.content);
	    	const terminator="###"
	    	var indexOfTerminator = message.content.indexOf(terminator);
	    	if (indexOfTerminator>0) {
	    		dataModelRaw = message.content.substring(0, indexOfTerminator);
	    		message.content = message.content.substring(indexOfTerminator+terminator.length);
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
	var dataModelEntities = document.getElementById("data-model-entities")
	dataModelEntities.innerHTML = ""
	var dataModel = JSON.parse(dataModelRaw);
	for (var i=0; i<dataModel.length; i++) {
		var entity = dataModel[i];
		var article = document.createElement("article");
		article.classList.add("message")
		var divHeader= document.createElement("div");
		divHeader.setAttribute("class", "message-header")
		article.appendChild(divHeader)
		divHeader.appendChild(document.createTextNode(entity.Name));
		var divBody= document.createElement("div");
		divBody.setAttribute("class", "message-body")
		article.appendChild(divBody)
		var ul = document.createElement("ul");
		divBody.appendChild(ul);
		for (var j=0; j<entity.Attributes.length; j++) {
			console.log(entity.Attributes[j]);
			var li = document.createElement("li");
			li.appendChild(document.createTextNode(entity.Attributes[j]));
			ul.appendChild(li)
		}
		dataModelEntities.appendChild(article);
	}	
}


