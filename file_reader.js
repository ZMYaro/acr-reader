var HEADER_OFFSET = 0x2000;

var SLICE_WIDTH = 256;
var SLICE_HEIGHT = 256;

/**
 * Load the ACR image from the <input>
 * @param e
 */
function loadACR(e) {
	e.preventDefault();
	
	if(window.File && window.FileReader && window.FileList && window.Blob) {
		var file = e.target.files[0];

		if(!file || !file.name.match(/.*\.acr$/)) {
			return;
		}
		var reader = new FileReader();
		reader.onload = readACR;
		reader.readAsArrayBuffer(file);
	} else {
		alert('Please switch to a browser that supports the file APIs, such as Google Chrome or Internet Explorer 11.');
	}
}

/**
 * Read the ACR image
 */
function readACR(e) {
	var buffer = e.target.result;
	buffer = buffer.slice(HEADER_OFFSET);
	var view = new DataView(buffer);
	
	var canvas = document.getElementById('canvas');
	var cxt = canvas.getContext('2d');
	
	var offset = 0;
	for(var i = 0; i < SLICE_HEIGHT; i++) {
		for(var j = 0; j < SLICE_WIDTH; j++) {
			var pixelHigh = view.getUint8(offset++);
			var pixelLow = view.getUint8(offset++);
			var pixel = pixelHigh << 4 | pixelLow >> 4;
			
			cxt.fillStyle = 'rgb(' + pixel + ', ' + pixel + ', ' + pixel + ')';
			cxt.fillRect(j, i, 1, 1);
		}
	}
	
	document.getElementById('img').src = canvas.toDataURL();
}

window.addEventListener('load', function() {
	document.getElementById('acrUpload').addEventListener('change', loadACR, false);
}, false);
