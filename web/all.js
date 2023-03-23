const API_KEY = ""
// TODO ^^ inject an OpenAI key here: https://platform.openai.com/account/api-keys
var messages = []


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
	update();
	return false;
}

function callGPT() {
	const url = "https://api.openai.com/v1/chat/completions"
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var response = JSON.parse(xhttp.responseText);
	    	var message = response.choices[0].message;
	    	messages.push(message);
	    	update();
	    }
	};
	body = { 
		model: "gpt-3.5-turbo",
		messages: messages
	 }
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.setRequestHeader("Authorization", "Bearer "+API_KEY);
	xhttp.send(JSON.stringify(body));
}

function update() {
	var history = document.getElementById("history")
	history.innerHTML = ""
	for (var i=0; i<messages.length; i++) {
		var div = document.createElement("div");
		div.appendChild(document.createTextNode(messages[i].role + ": " + messages[i].content));
		history.appendChild(div)
	}
}


