var deviceReady = $.Deferred();
var documentReady = $.Deferred();
var jqmReady = $.Deferred();
window.console.log = function (msg) { uglyLog(msg) };
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

  fileApi.initialize(function(err, apiRef){
    if(err) {
      console.log('file api error');
      console.log(err);
      return;
    }

    //inicializaciones dependientes de fileApi
    guias.initialize();
    entrevistas.initialize();
  });
}

function crearGuia() {
  var guia = {
    nombre: 'Curso Phonegap',
    id: guid(),
    preguntas: {
      1: {texto: "Preséntese y cuénteme por qué quiere hacer el curso de Phonegap"},
      2: {texto: "Nombre"},
      3: {texto: "Edad"},
      4: {texto: "Conocimientos previos"},
      5: {texto: "Experiencia en mobile"},
      6: {texto: "Experiencia general"}
    }
  };
  return guia;
}

function uglyLog(message){
    // console.log(message);
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
};

window.addEventListener('error',function(e){
    uglyLog(e.message || ''+e).textContent+=e.stack;
});

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
};

var guias = {
  lista: [], // <-- array para tener la lista de guias a mano
  ready: false,
  initialize: function(){
    guias.obtenerGuias(function(err, contents){
      if(err) {
        console.log('Error obteniendo el archivo de guias');
        guias.lista = [];
      }
      if(contents) {
        guias.lista = JSON.parse(contents);
      }
      guias.ready = true;
    });
  },
  guardarGuias: function(callback){
    var guiasEnTexto = JSON.stringify(guias.lista);
    fileApi.writeTextFile('guias.json', guiasEnTexto, function(){
      callback && callback();
    });
  },
  obtenerGuias: function(callback) {
    var onError = function(err) {
      callback && callback(err, null);
    }
    var onFile = function(fileEntry) {
      fileEntry.file(
        function(fileObject){
          var reader = new FileReader();
          reader.onloadend = function(){
            callback && callback(null, this.result);
          }
          reader.readAsText(fileObject);
        },
        onError
      );
    }
    fileApi.dir.getFile('guias.json', {create:true}, onFile, onError);
  }
};

var entrevistas = {
  lista: [],
  ready: false,
  initialize: function(){
    entrevistas.obtenerEntrevistas(function(err, contents){
      if(err) {
        console.log('Error obteniendo el archivo de entrevistas');
        entrevistas.lista = [];
      }
      if(contents) {
        entrevistas.lista = JSON.parse(contents);
      }
      entrevistas.ready = true;
    });
  },
  agregar: function(entrevista, callback) {
    entrevistas.lista.push(entrevista);
    entrevistas.guardarEntrevistas(function(){
      console.log('entrevista agregada y guardada');
      callback && callback(entrevista);
    });
  },
  guardarEntrevistas: function(callback){
    var entrevistasEnTexto = JSON.stringify(entrevistas.lista);
    fileApi.writeTextFile('entrevistas.json', entrevistasEnTexto, function(){
      callback && callback();
    });
  },
  obtenerEntrevistas: function(callback) {
    var onError = function(err) {
      callback && callback(err, null);
    }
    var onFile = function(fileEntry) {
      fileEntry.file(
        function(fileObject){
          var reader = new FileReader();
          reader.onloadend = function(){
            callback && callback(null, this.result);
          }
          reader.readAsText(fileObject);
        },
        onError
      );
    }
    fileApi.dir.getFile('entrevistas.json', {create:true}, onFile, onError);
  }
};

function clockFormat(secs) {
  secs = secs << 0;
  var minutes = (secs / 60) << 0;
  var seconds = secs % 60;
  minutes = minutes < 10 ? "0"+minutes : minutes;
  seconds = seconds < 10 ? "0"+seconds : seconds;
  return minutes+":"+seconds;
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

var recordApi = {
  initialize: function(callback){
    //referencia al boton
    recordApi.button = $('#record');

    //referencia al reloj
    recordApi.clock = $('#record-time');

    //inicializar estado
    recordApi.isRecording = false;

    //inicializar variable para el timer
    recordApi.timer = null;

    //referencia al directorio "audio"
    fileApi.getDir('audio', function(err, dir){
      if(err) {
        console.log(err);
        return;
      }
      recordApi.audioDir = dir;
      callback && callback();
    });
  },
  nuevaGrabacion: function(guiaId, callback){
    var fileName = guid();
    var onError = function(err) {
      callback && callback(err, null);
    }
    var onFile = function(fileEntry) {
      recordApi.entrevista = {
        id: fileName,
        audioPath: fileEntry.nativeURL,
        interview: guiaId,
        start: null,
        stop: null,
        tags: []
      };
      recordApi.recordFile = fileEntry.nativeURL;
      callback && callback(null, fileEntry);
    }
    recordApi.audioDir.getFile(fileName, {create:true}, onFile, onError);
  },
  createTagButton: function(ref) {
    var button = $('<button />')
      .addClass("ui-btn ui-btn-inline ui-mini")
      .text('+')
      .click(function(e){
        if(!recordApi.isRecording) {
          return;
        }
        console.log('tag ' + ref + ' @ ' + new Date());
        recordApi.entrevista.tags.push({ref: ref, time: new Date()});
      });
    return button;
  },
  updateClock: function(){
    var recordTime = ((new Date() - recordApi.entrevista.start) / 1000) << 0;
    recordApi.clock.text(clockFormat(recordTime));
  },
  record: function(){
    recordApi.media = new Media(recordApi.recordFile, recordApi.onStop, recordApi.onError, recordApi.onStatus);
    recordApi.media.startRecord();
  },
  stop: function(){
    recordApi.media.stopRecord();
  },
  onStop: function(){
    console.log('recordApi.onStop');
    recordApi.media.release();
    recordApi.media = null;
    recordApi.entrevista.stop = new Date();
    entrevistas.agregar(recordApi.entrevista, function(entrevista){
      $('#revision').data('entrevistaIdx',entrevistas.lista.length - 1);
      $(':mobile-pagecontainer').pagecontainer('change','#revision');
    });
    // mediaApi.load(recordApi.recordFile);
  },
  onError: function(err){
    console.log('Recording error');
    console.log(err);
  },
  onStatus: function(status){
    switch(status) {
      case Media.MEDIA_NONE: console.log('Status change: idle');
      break;
      case Media.MEDIA_STARTING:
        console.log('Status change: starting');
      break;
      case Media.MEDIA_RUNNING:
        console.log('Status change: running');
        recordApi.timer = setInterval(recordApi.updateClock,500);
        recordApi.isRecording = true;
        recordApi.entrevista.start = new Date();
        recordApi.button.css('background-color','red');
        recordApi.button.text('Detener');
        $.mobile.loading('hide');
      break;
      case Media.MEDIA_PAUSED: console.log('Status change: paused');
      break;
      case Media.MEDIA_STOPPED:
        console.log('Status change: stopped');
        clearInterval(recordApi.timer);
        recordApi.timer = null;
        recordApi.isRecording = false;
        recordApi.button.css('background-color', '#333');
        recordApi.button.text('Grabar');
      break;
      default: console.log('unknown status');
    }
  }
};