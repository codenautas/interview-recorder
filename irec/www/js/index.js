var deviceReady = $.Deferred();
var documentReady = $.Deferred();
var jqmReady = $.Deferred();
console.log('reading main script');

$(document).on('deviceready', function(){
    console.log('device is ready');
    deviceReady.resolve();
});
$(document).on('mobileinit', function(){
    console.log('jqm is ready');
    jqmReady.resolve();
});
$(document).ready(function(){
    console.log('document is ready');
    documentReady.resolve();
});

$.when(jqmReady,documentReady, deviceReady).then(init);


function init(){
  uglyLog('init');
  console.log('init');
  // Configuracion de JQM para phonegap
  $.mobile.allowCrossDomainPages = true;
  $.support.cors = true;
  $.mobile.buttonMarkup.hoverDelay = 0;
  $.mobile.pushStateEnabled = false;
  $.mobile.defaultPageTransition = "none";

  fileApi.initialize(function(err){
    if(err) { // <-- checkeamos si hay error
      console.log('file api error');
      console.log(err);
      return; // <-- y cortamos la ejecucion de ser asi
    }

    // aca va mas codigo de inicializacion
    // sabiendo que fileApi esta inicializado
  });
}

var fileApi = {
  ready: false, // <--solo por las dudas
  initialize: function(callback){
    var path = cordova.file.externalDataDirectory;
    //si no hay problemas, llamamos a callback con el primer
    //parametro en null (lo que seria el error)
    var onResolve = function(directoryEntry) {
      fileApi.dir = directoryEntry;
      fileApi.ready = true;
      callback && callback(null, fileApi);
    }
    //si hay un error llamamos a callback con el error
    //como primer parametro (ver arriba)
    var onError = function(err){
      callback && callback(err, fileApi);
    }
    window.resolveLocalFileSystemURL(path, onResolve, onError);
  },
  writeTextFile: function(file, content, callback) {
    var onFile = function(fileEntry) {
      fileEntry.createWriter(
        function(fileWriter){
          fileWriter.write(content);
          callback && callback(content);
        }, fileApi.onError);
    }
    fileApi.dir.getFile(file, {create: true}, onFile, fileApi.onError);
  },
  onError: function(err) {
    console.log(err);
  },
  getDir: function(dir, callback) {
    var onDir = function(dir){
      callback && callback(null, dir);
    }
    var onError = function(err) {
      callback && callback(err, null);
    }
    fileApi.dir.getDirectory(dir, {create:true}, onDir, onError);
  }
}


function uglyLog(message){
    var div=document.getElementById('uglyLog');
    if(!div){
        div=document.createElement('div');
        div.id='uglyLog';
        document.body.appendChild(div);
    }
    div.textContent=(div.textContent||'') + message+'. ';
    return div;
}

window.addEventListener('error',function(e){
    uglyLog(e.message || ''+e).textContent+=e.stack;
});