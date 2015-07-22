function onLoadDesktop(){
  // Function called when the body of the HTML
  // has loaded. Used for init stuff.

  var onMobile = determineIfMobile();

  if(onMobile){
    // Redirect to mobile page
    window.location = "mobile.html";
    return false;
  }

  fixEducationWidth()
  removeGPSScreenshotIfNeeded)()
}


function determineIfMobile(){
  var width = window.innerWidth;
  console.log(width)

  if (width <= 699) {
    console.log("On Mobile")
    return true;
  } else {
    return false;
  }
}

function removeGPSScreenshotIfNeeded(){
  var width = window.innerWidth;

  if(width <= 826){
    console.log("Removing GPS Screenshot")
    document.getElementById("#removable-gps-screenshot").style.display = "none";
  }
}

function sendEmail() {

  var name    = document.getElementById('contact-name-textfield').value
  var email   = document.getElementById('contact-email-textfield').value
  var message = document.getElementById('contact-message-textarea').value

  if (name == null || name == "") {
      sweetAlert("Oops...", "Be sure to put a name in the name text field!", "error");
      return false;
  }

  if (email == null || email == "") {
      sweetAlert("Oops...", "Be sure to put an email address in the email text field so I can get back to you!", "error");
      return false;
  }

  if (message == null || message == "") {
      sweetAlert("Oops...", "Be sure to put a message in the message text field!", "error");
      return false;
  }

  $.ajax({
   type: "POST",
   url: "https://mandrillapp.com/api/1.0/messages/send.json",
   data: {
     "key": "8uH_LPyaJAm7joaXrr7RAQ",
     "message": {
       "from_email": "will.taylor@tcu.edu",
       "to": [
           {
             "email": "will.taylor@tcu.edu",
             "name": "Will",
             "type": "to"
           }
         ],
       "autotext": "true",
       "subject": "Contact From Resume Website",
       "text": "Name: ".concat(name).concat("\n\n").concat("Email Address: ").concat(email).concat("\n\n").concat("Message: ").concat(message)
     }
   }
  }).done(function(response) {
    swal("Message Sent!", "I'll get back to you within one business day. Thanks!", "success");
    console.log(response);
  });
}


function fixEducationWidth(){
  // Called on to fix the width of the education card to match the width
  // of the work experience card

  // Get work experience width
  var workExperienceCardWidth = $("#work-experience").width();

  // Set education card width
  $("#education-card").width(workExperienceCardWidth);
}
