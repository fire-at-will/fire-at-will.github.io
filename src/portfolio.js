function onBodyLoad(){

  configureNavBarColorChanging();

  typeHelloWorld();
  fadeInInfo();

  // Configure scroll function
  selectors.get(window).on('scroll', scrollTasks);
  selectors.get(window).on('scroll resize', scrollTasks);

  // Trigger a scroll event as soon as DOM is ready, so any of the elements
  // that are visible get animated
  selectors.get(window).trigger('scroll');
}

function scrollTasks(){
 
  checkIfInView();
}

function checkIfInView(){
  var windowHeight          = selectors.get(window).height();
  var windowTopPosition     = selectors.get(window).scrollTop();
  var windowBottomPosition  = (windowTopPosition + windowHeight);

  $.each(selectors.get('.animate-from-left'), function(){
    var $element = $(this);
    var elementHeight = $element.outerHeight();
    var elementTopPosition = $element.offset().top;
    var elementBottomPosition = (elementTopPosition + elementHeight);

    //check to see if this current container is within viewport
    if ((elementBottomPosition >= windowTopPosition) && (elementTopPosition <= windowBottomPosition)) {
      $element.addClass('bounceInLeft');
    } else {
      $element.removeClass('bounceInLeft');
    }
  });

  $.each(selectors.get('.animate-from-right'), function(){
    var $element = $(this);
    var elementHeight = $element.outerHeight();
    var elementTopPosition = $element.offset().top;
    var elementBottomPosition = (elementTopPosition + elementHeight);

    //check to see if this current container is within viewport
    if ((elementBottomPosition >= windowTopPosition) && (elementTopPosition <= windowBottomPosition)) {
      $element.addClass('bounceInRight');
    } else {
      $element.removeClass('bounceInRight');
    }
  });
}

function fadeInInfo(){
  setTimeout(function(){fadeIn("my-name");}, 2200);
  setTimeout(function(){fadeIn("my-info");}, 3500);
    
}

function scrollPastFirstSection(){
  //document.getElementById('portfolio-section').scrollIntoView();
  selectors.get('html, body').animate({
        scrollTop: selectors.get('#job-section').offset().top
    }, 2000);
}

// Uses type it plugin to type "Hello, world.".
function typeHelloWorld(){
  // Make header visible
  document.getElementById("hello-world").style.visibility = "visible";

  selectors.get('#hello-world').typeIt({
    speed: 50,
  })
  .tiType('Hello,')
  .tiPause(250)
  .tiType(' world.');
}

function configureNavBarColorChanging(){
  // Work Experience section color change
  var scroll_start = 0;
  var startchange = selectors.get('#job-section');
  var offset = startchange.offset();
  selectors.get(document).scroll(function() { 
  scroll_start = $(this).scrollTop();
  if(scroll_start > offset.top) {
      selectors.get('#navbar').css('background-color', 'white');
      selectors.get('#link1').css('color', '#000000');
   } else {
      selectors.get('#navbar').css('background-color', 'transparent');
   }
  });
}

function changeNavbarTextColors(color){
  // ******* TODO ********
  // For each piece of text,
  // changeDivColor("#name", "#color")
}

function changeDivColor(divName, color){
  selectors.get(divName).css('color', color);
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

// Selector caching. See 
// https://ttmm.io/tech/selector-caching-jquery/
// for more details
function Selector_Cache() {
    var collection = {};

    function get_from_cache( selector ) {
        if ( undefined === collection[ selector ] ) {
            collection[ selector ] = $( selector );
        }

        return collection[ selector ];
    };

    return { get: get_from_cache };
}

var selectors = new Selector_Cache();