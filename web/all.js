var msgs = []


function submitUserInput(e) {
	e.preventDefault();
	var input = document.getElementById("chat-input")
	var msg = input.value;
	msgs.push(msg)
	input.value = ""
	update()
	return false;
}

function update() {
	var history = document.getElementById("history")
	history.innerHTML = ""
	for (var i=0; i<msgs.length; i++) {
		var div = document.createElement("div");
		div.appendChild(document.createTextNode(msgs[i]));
		history.appendChild(div)
	}

}


