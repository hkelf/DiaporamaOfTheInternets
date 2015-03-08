(function () {
	var diaporamaMode = false;
	
	var menu = document.getElementById('menu');
	var diaporama = document.getElementById('diaporama');
	var search = document.getElementById('search');
	var imageContainer = document.getElementById('imageContainer');
	var stop = document.getElementById('stop');
	imageContainer.addEventListener('load', prepareNextImage);

	var images;
	var currentImageIndex = 0;

	var utternace;
	var langs = [
		'en-US',
		'es-ES',
		'fr-FR',
		'pt-PT',
		'zh-HK'
	];

	window.addEventListener('keydown', function (event) {
		if (event.keyCode === 13) {
			if (!diaporamaMode) {
				startDiaporama();
			}
		}
	})

	stop.addEventListener('click', function () {
		endDiaporama();
	})

	function switchDisplay() {
		menu.hidden = !menu.hidden;
		diaporama.hidden = !diaporama.hidden;
	}

	function startDiaporama() {
		var request = new XMLHttpRequest();
		var searchText = search.value;

		utternace = new SpeechSynthesisUtterance(searchText);

		request.open('GET', 'search/' + searchText);
		request.onreadystatechange = function (aEvt) {
			if (request.readyState == 4) {
				if(request.status == 200) {
					images = JSON.parse(request.responseText);
					displayImages();
				}
				else console.log("Error when loading images");
			}
		};

		imageContainer.hidden = true;
		diaporamaMode = true;
		switchDisplay();

		request.send();
	}

	function endDiaporama() {
		switchDisplay();
		diaporamaMode = false;
	}

	/*function loadNewImages() {
		setTimeout();
	}*/

	function displayImages() {
		if (diaporamaMode) {
			imageContainer.src = images[currentImageIndex];
			imageContainer.hidden = false;
		}
	}

	function prepareNextImage() {
		if (diaporamaMode) {
			utternace.lang = langs[~~(Math.random() * langs.length)];
	    	utternace.pitch = Math.random() * 2;
	    	utternace.rate = 0.1 + Math.random() * 9.9;
	    	window.speechSynthesis.speak(utternace);

			currentImageIndex = ~~(Math.random() * images.length);

			setTimeout(displayImages,2000);
		}		
	}
})()