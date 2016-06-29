var processingInstance;
var flag = true;
function startSketch(instanceId) {
	switchSketchState(true, instanceId);
}

function stopSketch(instanceId) {
	switchSketchState(false, instanceId);
}

function switchSketchState(on, instanceId) {
	//console.log("switchSketchState: " + on);
	if (!processingInstance) {
		processingInstance = Processing.getInstanceById(instanceId);
	}

	if (on) {
		processingInstance.loop();  // call Processing loop() function
	} else {
		processingInstance.noLoop(); // stop animation, call noLoop()
	}
}