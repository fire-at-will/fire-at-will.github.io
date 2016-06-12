var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

var canvas = document.getElementById('imageCanvas');
var canvasDiv = document.getElementById('canvasDiv');
canvas.width = canvasDiv.clientWidth;
canvas.height = canvasDiv.clientHeight;

$("canvasDiv").hide();

var image = new Image();

var ctx = canvas.getContext('2d');

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){

          // Magic image sorcery from stack overflow
          // http://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly
          canvas.height = canvas.width * (img.height / img.width);

          var oc = document.createElement('canvas'), octx = oc.getContext('2d');

          oc.width = img.width * 0.5;
          oc.height = img.height * 0.5;
          octx.drawImage(img, 0, 0, oc.width, oc.height);

          octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

          ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
          0, 0, canvas.width, canvas.height);
        }
        img.src = event.target.result;
        image.src = event.target.result;

    }
    reader.readAsDataURL(e.target.files[0]);
}

function sortImage(){

}
