var minR = -2.8;
var maxR = 2;

var minI = -1.4;
var maxI = 1.4;

var zoomRate = .60;

var maxIterations = 100;

var fullscreen = false;
var autoIncrementIterations = true;
var palatteMode = 'smooth';
var pattern = "Smooth Blue"

var smoothColors = ['Smooth Blue', 'Smooth Red', 'White on Black', 'Smooth Grayscale', 'Experimental', 'Bob Marley',
 'White on Sky Blue', 'Red on Black'];

var height;
var width; 

// Web worker to execute fractal rendering code
var fractalWorker;

function onLoad(){

	height 		= window.innerHeight;
	width		= window.innerWidth;

	initCanvas(width, height);

	generateSmoothColorPalatte('Smooth Blue');

	$('#iteration-input').change(function(){
		maxIterations = parseInt($('#iteration-input').val());
		generateMandelbrot();
	});

	$('[data-toggle=popover]').popover({ trigger: 'manual' , html: true, animation:false})
	.on('mouseenter', function () {
	    var _this = this;
	    $(this).popover('show');
        setCorrectPalatteToggle();
	    $('.popover').on('mouseleave', function () {
	        $(_this).popover('hide');
		    });
		}).on('mouseleave', function () {
		    var _this = this;
		    setTimeout(function () {
		        if (!$('.popover:hover').length) {
		            $(_this).popover('hide');
		        }
		}, 300);
	});


	adjustToScreenAspectRatio();

	generateMandelbrot();
}

function setCorrectPalatteToggle(){
    
    document.getElementById("Smooth-Blue").checked = false;
    document.getElementById("Smooth-Red").checked = false;
    document.getElementById("Smooth-Grayscale").checked = false;
    document.getElementById("Red-on-Black").checked = false;
    document.getElementById("White-on-Black").checked = false;
    document.getElementById("White-on-Sky-Blue").checked = false;
    document.getElementById("Experimental").checked = false;
    document.getElementById("Red").checked = false;
    document.getElementById("Blue").checked = false;
    document.getElementById("Green").checked = false;
    document.getElementById("Purple").checked = false;
    document.getElementById("Bob-Marley").checked = false;

    var checkedId = pattern.replace(/ /g, '-');
    console.log(checkedId);
    document.getElementById(checkedId).checked = true;


}

function scrollToAbout(){
    $('html, body').animate({
        scrollTop: ($('#aboutSection').offset().top)
    },750);
}

function settingsToggleClicked(){
    // Toggle between show/hide settings text
	var currentText = document.getElementById("showSettingsToggle").innerHTML;
	console.log(currentText);
	if(currentText == "Show Settings"){
        document.getElementById("showSettingsToggle").innerHTML = "Hide Settings";
    } else {
        document.getElementById("showSettingsToggle").innerHTML = "Show Settings";
    }
}

// function renderFractal() {
//     if(typeof(Worker) !== 'undefined') {
//         if(typeof(fractalWorker) == 'undefined') {
//             fractalWorker = new Worker('js/mandelbrot.js');
//         }
//         fractalWorker.onmessage = function(event) {
//             document.getElementById('result').innerHTML = event.data;
//         };
//     } else {
//         // document.getElementById('result').innerHTML = 'Sorry! No Web Worker support.';\
//         console.log('No web worker support.');
//     }
// }
//
// function stopWorker() {
//     fractalWorker.terminate();
//     fractalWorker = undefined;
// }

function getSelectedPalatteMode(){

    	palatteMode = $('input[name=palatte]:checked').val();
    	$('#palatte-dropdown').text(palatteMode);
        pattern = palatteMode;
    	if(isColorModeSmooth(palatteMode)){
    		generateSmoothColorPalatte(palatteMode);
    		palatteMode = 'smooth';
    	}
    	generateMandelbrot();
	
}
