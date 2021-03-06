$(function() {
	//Load the raleway theme.
	var style = $(
		'<style>' +
			'@font-face {' + 
			'font-family: "Raleway";' +
			'src: url("' + chrome.extension.getURL('css/Raleway-Regular.ttf') + '")' + 
			'}' +
		'</style>');
	$('head').append(style); 
	/*
		Attaches the color pickers and binds them to $scope.
	*/
	var scope = angular.element(document.body).scope();
	$.each(defaultTheme.colors, function(key, value) {
		$('#' + key).farbtastic(function(color, scoped) {
			// If we are already in angularjs scope.
			if (scoped) {
				// Change the specific color and save it.
				scope.theme.colors[key] = color;
				saveTwice('theme', scope.theme);
			} else {
				scope.$apply(function() {
					scope.theme.colors[key] = color;
					saveTwice('theme', scope.theme);
				});
			}
			updateStyle(false);
		});

		// Add a listener to update farbtastic when a color is changed.
		scope.$watch('theme.colors["' + key + '"]', function(newVal, oldVal) {
			$.farbtastic('#' + key).setColor(newVal, true);
		});
	});

	// Add a listener to update the page item count when the window is resized.
	$(window).resize(function() {
		scope.$apply(function() {
			scope.setPageItemCount(getPageItemCount());
		});
	});

	scope.setPageItemCount(getPageItemCount());
});

/**
	Compares window height to element height to fine the number of elements per page.

	returns: The number of items to fit on a page.
*/
var getPageItemCount = function() {
	var height = $('body').height() - ($('h1').outerHeight(true) + $('.page-chooser').outerHeight(true) + $('.footer').outerHeight(true));
	jss('.external', {
		'height': height
	});
	jss('.bookmark_page', {
		'height': height
	});

	return Math.floor((height) / 60) - 1;
}

/**
	Changes the style to whatever is in the scope.

	transition: A bool indicating whether to slowly transition or immediately change.
*/
var updateStyle = function(transition) {
	var scope = angular.element(document.body).scope();

	var options_color = '#ff0000';
	var background_color = '#ff0000';
	var main_color = '#ff0000';
	var title_color = '#ff0000';

	if (scope.theme) {
		background_color = scope.theme.colors['background-color'];
		options_color = scope.theme.colors['options-color'];
		main_color = scope.theme.colors['main-color'];
		title_color = scope.theme.colors['title-color'];
	}

	if(scope.font == 0) {
		jss('body', {
			'font-family': '"Segoe UI", Helvetica, Arial, sans-serif',
		});
	} else { 
		jss('body', {
			'font-family': 'Raleway, "Segoe UI", Helvetica, Arial, sans-serif',
		});
	}

	jss('*', {
		'border-color': options_color
	});

	jss('::-webkit-scrollbar', {
		'background': background_color
	});

	jss('::-webkit-scrollbar-thumb', {
		'background': options_color
	});

	jss('::-webkit-input-placeholder', {
		'background': main_color
	});

	// Transition the colors, but then we still add it to the DOM.
	if (transition) {
		$('.background-color').animate({'backgroundColor': background_color}, {duration: 800, queue: false});
		$('.title-color').animate({'color': title_color}, {duration: 400, queue: false});
		$('body').animate({'color': main_color}, {duration: 400, queue: false});
		$('input').animate({'color': main_color}, {duration: 400, queue: false});
		$('.options-color').animate({'color': options_color}, {duration: 400, queue: false});
	}

	jss('.title-color', { 
		'color': title_color
	});
	jss('.background-color', { 
		'background-color': background_color
	});
	jss('.bookmark-active', {
		'color': options_color
		//'border-bottom': '2px solid ' + options_color 
	});
	jss('body', { 
		'color': main_color
	});
	jss('input', { 
		'color': main_color
	});
	jss('.options-color', { 
		'color': options_color
	});
}
