// @todo - handle errors with images being loaded into the lightbox that aren't available in the larger size
// @todo - test in all modern browsers!!
// @todo - add next/prev buttons to lightbox
// @todo - add click handler to the overlay to close the lightbox

var apiKeyRandomWord = "po55N0vjeymshiks9mSUPBJtNGqep1N2oJNjsnwKGuu2YFB1vQ",
	imagesPerPage = 30,
	imagesCurrentpage = 1, // The page numbers in Flickr start at 1 (not 0)
	searching = false,
	showingImageId = -1,
	imagesCount = -1;

// Set focus on the search input
document.getElementById("search-for").focus();

/**
 * Search for images that match a sting
 * 
 * @method imageSearch
 */
function imageSearch() {
	// Get the string the user wants to search for
	if (searching)
		return;

	var str = document.getElementById("search-for").value.trim();

	if (str === "") {
		// Missing a string to search for
		alert("enter a value first"); // @todo - make prettier
	} else {
		// Do an image search
		// Show the busy icon in the search field
		document.getElementById("search-icon").setAttribute("class", "fa fa-circle-o-notch fa-spin fa-fw margin-bottom spinning");

		// Disable the search so it won't be fired again
		searching = true;

		var xhr = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.onreadystatechange = function() {
			if (this.readyState === 4) { // Done
				if (this.status === 200) {
					// Move the search field to the top of the screen to make room for the thumbnails
					document.getElementById("search-for").style.marginTop = 0;
					document.getElementById("instructions").style.display = "none";
					document.querySelector("footer").style.display = "block";

					imagesCount = this.response.photos.photo.length;

					displayThumbs(this.response.photos.photo, str);
				} else {
					// @todo - add better error handling
					console.log('err');
				}
			}
		};
		xhr.open("GET", "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e43670ebe01ba2f7213f4261306293eb&text=" + str + "&per_page=" + imagesPerPage + "&page=" + imagesCurrentpage + "safe_search=1&sort=relevance&format=json&nojsoncallback=1");
		xhr.send();
	};
};

/**
 * Display thumbnails from JSON
 *
 * @method displayThumbs
 * @param {Object} json An object containing the image to show the user
 * @param {String} str The string that was searched for (will be used in image alt text if a title is missing)
 */
function displayThumbs(json, str) {
	var len = json.length,
		frag = document.createDocumentFragment(), // Create an arbitary node-like element to hold our thumbnails
		divClass = window.innerWidth > 500 ? "col-2" : "col-4";

	if (len === 0) {

		// No thumbnails to show
		document.getElementById("results").innerHTML = "<div id='no-results'>No results :(</div>";

	} else {

		// Clear the current thumbnails if there are any
		document.getElementById("results").innerHTML = "";

		// Iterate through the list of images that were returned and build the thumbnails
		for (var i = 0; i < len; i++) {
			// Create the thumbnails that we'll be adding to the UI
			var div = document.createElement("div"),
				img = document.createElement("img");

			div.setAttribute("class", divClass);

			img.setAttribute("data-image-id", i);
			img.setAttribute("src", "https://farm" + json[i].farm + ".staticflickr.com/" + json[i].server + "/" + json[i].id + "_" + json[i].secret + "_q.jpg");
			img.setAttribute("alt", json[i].title || "Image of a " + str);
			img.setAttribute("title", json[i].title || "Image of a " + str);

			// Add a click handler for the image to trigger the lightbox
			img.onclick = function() {
				showFullsize( this.getAttribute("src"), parseInt(this.getAttribute("data-image-id")), this.getAttribute("title") );
			};

			div.appendChild(img);
			
			frag.appendChild(div);
		};

		// Bulk add the fragments to the UI
		document.getElementById("results").appendChild(frag);

	};

	// Reset the seach icon
	document.getElementById("search-icon").setAttribute("class", "fa fa-search");

	// Re-enable the search
	searching = false;
};

/**
 * Show the full size image in a lightbox
 *
 * @method showFullsize
 * @param {String} url The URL of the image to show in the lightbox
 * @param {String} imageId The current image ID being displayed
 * @param {String} title The title of the image
 */
function showFullsize(url, imageId, title) {
	//url = url.replace("q.jpg", "h.jpg"); // @todo - discard this
	url = url.replace("q.jpg", "c.jpg");

	if (showingImageId !== -1) {
		// The lightbox is already open, so just update the image being displayed
		document.getElementById("full-img").setAttribute("src", url);
		document.getElementById("full-img-title").innerText = title;
	} else {
		// Show the lightbox
		showingImageId = imageId;
		document.getElementById("overlay").style.display = "block";
		document.getElementById("lightbox").style.display = "block";
		document.getElementById("close-image").style.visibility = "hidden";

		// Slight delay here or the animation won't be shown
		setTimeout(function() {
			document.getElementById("overlay").setAttribute("class", "fadein");

			setTimeout(function() {
				document.getElementById("full-img").setAttribute("src", url);
				document.getElementById("full-img-title").innerText = title;
				document.getElementById("close-image").style.visibility = "visible";
			}, 150) // @todo - see if this can be handled by an event instead of a timer
		}, 100); // @todo - see if this can be handled by an event instead of a timer

		updateLightboxNavButtons();

		// Add a keypress listener to the body so we can catch the `escape` key & 
		// the right and left arrow keys
		document.onkeydown = function(e) {
			var evt = e || window.event; // Helps with crossbrowser support

			var isEscape = false,
				isLeftArrow = false,
				isRightArrow = false;
			
			if ("key" in evt) {
				isEscape = (evt.key === "Escape" || evt.key === "Esc");
				isLeftArrow = (evt.key === "ArrowLeft");
				isRightArrow = (evt.key === "ArrowRight");
			} else {
				isEscape = (evt.keyCode === 27);
				isLeftArrow = (evt.keyCode === 37);
				isRightArrow = (evt.keyCode === 39);
			};

			if (isEscape) {
				closeLightbox();
			} else if (isLeftArrow) {
				// Show the previous image
				showPreviousImage();
			} else if (isRightArrow) {
				// Show the next image
				showNextImage();
			}
		};
	};
};

/**
 * Show the previous image in the lightbox
 *
 * @method showPreviousImage
 */
function showPreviousImage() {
	var element;

	if (showingImageId > 0) {
		// Decrement the image Id that's being displayed
		showingImageId--;
	};

	updateLightboxNavButtons();

	element = document.querySelectorAll("[data-image-id='" + showingImageId + "']")
	showFullsize( element[0].getAttribute("src"), null, element[0].getAttribute("title") );
};

/**
 * Show the next image in the lightbox
 *
 * @method showPreviousImage
 */
function showNextImage() {
	var element;
	
	if (showingImageId < imagesCount - 1) {
		// Increment the image Id that's being displayed
		showingImageId++;
	};

	updateLightboxNavButtons();

	element = document.querySelectorAll("[data-image-id='" + showingImageId + "']")
	showFullsize( element[0].getAttribute("src"), null, element[0].getAttribute("title") );
};

/**
 * Update which buttons on the lightbox are visible
 *
 * @method updateLightboxNavButtons
 */
function updateLightboxNavButtons() {
	if (showingImageId === 0) {
		// At the first image, so hide the previous image button
		document.getElementById("prev-image").style.visibility = "hidden";
	} else {
		document.getElementById("prev-image").style.visibility = "visible";
	};

	if (showingImageId === imagesCount - 1) {
		// At the last image, so hide the next image button
		document.getElementById("next-image").style.visibility = "hidden";
	} else {
		document.getElementById("next-image").style.visibility = "visible";
	};
};

/**
 * Close the lightbox and hide the overlay
 *
 * @method closeLightbox
 */
function closeLightbox() {
	document.getElementById("overlay").setAttribute("class", null);
	document.getElementById("lightbox").style.display = "none";
	document.getElementById("full-img").setAttribute("src", "");
	document.getElementById("full-img-title").innerText = "";

	// Slight delay to hide the overlay just so we give the transition
	// a chance to play out
	setTimeout(function() {
		document.getElementById("overlay").style.display = "none";
	}, 300); // @todo - see if this can be handled by an event instead of a timer

	// Remove the `onkeydown` handler
	document.onkeydown = null;

	showingImageId = -1;
};

/**
 * Handle a keypress event for the inpout field to see if `enter` is pressed
 *
 * @method checkKeypress
 */
function checkKeypress(e) {
	var evt = e || window.event; // Helps with crossbrowser support

	var keyCode = evt.keyCode || evt.which;
	if (keyCode == '13'){
		// Enter pressed
		imageSearch();
	}
};