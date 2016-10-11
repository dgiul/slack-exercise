# Slack Exercise

This is an implementation of the lightbox exercise for Slack. See a working example [here](http://dangiulvezan.com/slack-exercise/).

This web app uses the Flickr API to allow the user to search for images. The search will return up to 30 results, sorted by relevance.

The results are displayed in a 6 x 5 grid of thumbnails on large screens, and a 3 x 10 grid of thumbnails on small screens.

Clicking on a thumbnail will show a larger version of the image in a lightbox, and below the larger image will be:

- A previous button to move the previous image in the grid (unless the user is viewing the first image, in which case the previous button will be hidden)
- A close button to close the lightbox and return to the grid
- A next button to move the next image in the grid (unless the user is viewing the last image, in which case the next button will be hidden)

Several keyboard shortcuts have also been implemented  when the lightbox is visible:

- The left arrow key moves to the previous image
- The right arrow key moves to the next image
- The escape key close the lightbox

## Project Requirements

Create a web page that shows a grid of photo thumbnails; when a thumbnail is clicked, the photo should be displayed in a lightbox view, with the ability to move to the next / previous photos and display the photo title.

## 3rd Party Libs and APIs

This project makes use of the Lato font from [Google Fonts API](https://developers.google.com/fonts/), [Font Awesome](http://fontawesome.io/) for icons, and the [Flickr API](https://www.flickr.com/services/api/) for image searches.

## Installation

Copy the contents to a web server and navigate to the `index.html` file.

## Tested On

- Windows 10 / Edge 13
- Windows 10 / Edge 14
- Windows 10 / IE 11
- Windows 10 / Firefox 49
- Windows 10 / Chrome 53
- Mac Sierra / Safari 10
- Mac Sierra / Firefox 49
- Mac Sierra / Chrome 53
- iOS 10 / Safari 10
