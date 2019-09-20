function saveToFile(output){
	const saveAnchor = document.createElement("a");
	saveAnchor.download = "random.txt"
	saveAnchor.href = "data:application/javascript;charset=utf-8," + encodeURIComponent(output);
	document.body.appendChild(saveAnchor);
	saveAnchor.click();
};