
function createTagButton(ref){
  var button = $('<button />');
  button.text('+')
  button.click(function(e){
    console.log('agregar tag ' + ref + ' en ' + new Date());
  });
  return button;
}

function createSeekButton(time){
  var button = $('<button />')
    .text('Go!')
    .click(function(e){
      console.log('reproducir desde '+time);
    });
  return button;
}

function getRecordFile(callback){ // <-- recibimos una func como parametro
  var root = cordova.file.externalDataDirectory;
  window.resolveLocalFileSystemURL(root, function(rootDir){
    rootDir.getDirectory('audio', {create: true}, function(audioDir){
      audioDir.getFile('record.amr', {create: true}, function(file){
        callback(file); // <-- ejecutamos la funcion, pasandole
                        // el resultado
      });
    });
  });
}

function clockFormat(secs) {
  secs = secs << 0;
  var minutes = (secs / 60) << 0;
  var seconds = secs % 60;
  minutes = minutes < 10 ? "0"+minutes : minutes;
  seconds = seconds < 10 ? "0"+seconds : seconds;
  return minutes+":"+seconds;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function uglyLog(message){
    console.log(message);
    if($){
        $('[data-role=footer]').append(
            $('<p>').text(message).addClass('uglylog').click(function(){
                $('.uglylog').remove();
            })
        );
    }else{
        var div=document.getElementById('uglyLog');
        if(!div){
            div=document.createElement('div');
            div.id='uglyLog';
            document.body.appendChild(div);
        }
        div.textContent=(div.textContent||'') + message+'. ';
        return div;
    }
}

function uglyError(modulo,err){
    uglyLog(modulo);
    uglyLog(err.message || err);
    uglyLog(err.stack);
}
