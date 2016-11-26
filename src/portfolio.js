function onBodyLoad(){
  addDynamicHeaderSizes();

  typeHelloWorld();
  fadeInInfo();
}

function fadeInInfo(){
  setTimeout(function(){fadeIn("my-name");}, 2500);
  setTimeout(function(){fadeIn("my-info");}, 3500);
    
}

function scrollPastFirstSection(){
  console.log("Scroll");
  document.getElementById('portfolio-section').scrollIntoView();
}

// Uses type it plugin to type "Hello, world.".
function typeHelloWorld(){
  // Make header visible
  document.getElementById("hello-world").style.visibility = "visible";

  $('#hello-world').typeIt({
    speed: 50,
  })
  .tiType('Hello,')
  .tiPause(250)
  .tiType(' world.');
}

function addDynamicHeaderSizes(){
  // Add and remove shrink class to navbar as appropriate based
  // on scrolling
  $(window).scroll(function() {
    if ($(document).scrollTop() > 50) {
      $('nav').addClass('shrink');
    } else {
      $('nav').removeClass('shrink');
    }
  });
}

function fadeIn(elementName) {
    // Get element
    var element = document.getElementById(elementName);

    // Ensure that element is invisible
    element.style.opacity = 0;

    var tick = function () {
        // Increment opacity
        element.style.opacity = +element.style.opacity + 0.01

        // Request screen repaint
        if (+element.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
        }

    };

    tick();
}