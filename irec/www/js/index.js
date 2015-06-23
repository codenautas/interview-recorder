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
    //inicializaciones dependientes de fileApi
    guias.initialize();
    entrevistas.initialize();
    
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
      guias.lista.push(crearGuia());
      guias.guardarGuias(function(){console.log('se guardaron las guias')})

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
}

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
}

function crearGuia() {
  var guia = {
    nombre: 'Curso Phonegap',
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

/*
function crearEntrevista(){
  var entrevista = {
    interview: 34,
    start: '2001-12-14T21:59:43.10-03:00',
    stop: '2001-12-14T22:11:02.35-03:00',
    tags: [
      {
        ref: 1,
        time: '2001-12-14T22:00:18.15-03:00'
      },
      {
        ref: 5,
        time: '2001-12-14T22:03:21.33-03:00'
      },
      {
        ref: 2,
        time: '2001-12-14T22:04:02.22-03:00'
      },
      {
        ref: 3,
        time: '2001-12-14T22:04:02.43-03:00'
      },
      {
        ref: 5,
        time: '2001-12-14T22:07:41.56-03:00'
      }
    ]
  }
  return entrevista;
}

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

  $('#home').on('pagecreate', function(e){
    uglyLog('pageCreate');
    //creamos el modelo de datos
    var guia = crearGuia();

    //seleccionamos el div con id=guia
    var container = $('div#guia', this);

    //lo vaciamos
    container.empty();

    //creamos una entrevista para revision
    var entrevista = crearEntrevista();

    $.each(guia.preguntas, function(i,e){
      //creamos un div
      var div = $('<div />');
      
      div.append( createTagButton(i) );
      
      //le asignamos el texto de la pregunta
      div.append(e.texto);

      var tags = entrevista.tags.filter(function(tag){
        //devolvemos true solo si el tag.ref es igual
        //al key de la pregunta
        return tag.ref == i;
      });
      //y ahora que tenemos el array tags, iteramos
      $.each(tags, function(ii,ee){
        //creamos el boton y lo agregamos al div
        div.append( createSeekButton(ee.time) );
      });

      //y lo agregamos al container (div#respuestas)
      container.append(div);
    });
  });
  
var mediaApi = {
  pathToPlay: 'media stop/played/rec success',
  initialize: function() {
    uglyLog('new');
    //asignamos una instancia de Media a mediaApi.audio
    mediaApi.audio = new Media('/android_asset/www/intro.mp3', mediaApi.onSuccess, mediaApi.onError, mediaApi.onStatus);

    //inicializacion de botones
    $('#play').click(function(e) {
      e.preventDefault();
      mediaApi.play();
    });

    $('#pause').click(function(e){
      e.preventDefault();
      mediaApi.pausa();
    });    

    //inicializacion de indicadores de tiempo
    mediaApi.currentTime = $('#currentTime').text(0);
    mediaApi.totalTime = $('#totalTime').text(0);

    //inicializacion de estado de reproduccion
    mediaApi.isPlaying = false;

    uglyLog('to load');
    
    mediaApi.load('/android_asset/www/schuman.mp3');
  },
  //a partir de aca son los handlers/calllbacks
  //de success, status y error.
  onSuccess: function(){
    if(mediaApi.interval) { // <-- check
      clearInterval(mediaApi.interval); // <-- clear
      // mediaApi.currentTime.text(0); // <-- reset
      mediaApi.interval = null; // <-- reset
      mediaApi.isPlaying = false; // <-- switch
    }
    console.log(mediaApi.pathToPlay);
  },  
  onStatus: function(status) {
    switch(status) {
      case Media.MEDIA_NONE: console.log('Status change: idle');
      break;
      case Media.MEDIA_STARTING: console.log('Status change: starting');
      break;
      case Media.MEDIA_RUNNING:
        console.log('Status change: running');
        if(!mediaApi.audio.initialized) { // <-- check!
          mediaApi.audio.getCurrentPosition(function(){
            console.log(mediaApi.audio._duration);
            mediaApi.audio.stop(); // <-- STOP!
            mediaApi.audio.initialized = true; // <-- switch
          });
        }
      break;
      case Media.MEDIA_PAUSED: console.log('Status change: paused');
      break;
      case Media.MEDIA_STOPPED: console.log('Status change: stopped');
      break;
      default: console.log('unknown status');
    }
  },
  onError: function(err) {
    console.log('Error');
    console.log(err);
  },
  play: function() {
    if(mediaApi.isPlaying) {
      return;
    }
    if(mediaApi.interval){
      clearInterval(mediaApi.interval);  
      mediaApi.interval=null;
    }
    mediaApi.interval = setInterval(function(){
      mediaApi.audio.getCurrentPosition(function(t){
        mediaApi.currentTime.text(t.toFixed(2));
      });
    },100);
    mediaApi.isPlaying = true;
    mediaApi.audio.play();
  },
  pausa: function() {
    if(!mediaApi.isPlaying) {
      return;
    }
    if(mediaApi.interval){
        clearInterval(mediaApi.interval);
        mediaApi.interval=null;
    }
    mediaApi.isPlaying = false;
    mediaApi.audio.pause();
  },
  load: function(path) {
    if(mediaApi.isPlaying) { // <-- check
      mediaApi.pausa();
    }
    if(mediaApi.audio) { // <-- check
      mediaApi.audio.release();
    }
    mediaApi.audio = new Media(path, mediaApi.onSuccess, mediaApi.onError, mediaApi.onStatus);
    //falso play
    mediaApi.interval2 = setInterval(function(){
      var dur = mediaApi.audio.getDuration();
      mediaApi.totalTime.text(dur.toFixed(2)+'...');
      if(dur>0){
          clearInterval(mediaApi.interval2);
      }
      mediaApi.audio.seekTo(100,function(){
        var dur = mediaApi.audio.getDuration();
        mediaApi.totalTime.text(dur.toFixed(2)+'.');
        mediaApi.currentTime.text(t.toFixed(2));
        if(dur>0){
            clearInterval(mediaApi.interval2);
            mediaApi.audio.seekTo(0);
        }
      });
    },1000);
    console.log('audio file loaded');
  },
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

var recordApi = {
  initialize: function(){
    //guardamos una referencia al boton
    uglyLog('button');

    recordApi.button = $('#rec');
    //inicializar el boton
    
    recordApi.button.click(function(e){
      e.preventDefault();
      if(recordApi.isRecording) {
        recordApi.stop();
      }else{
        recordApi.record();
      }
    });

    //inicializar estado
    recordApi.isRecording = false;

    //obtener la ruta al archivo de grabacion
    getRecordFile(function(file){
      uglyLog('getRecord');
      recordApi.button.prop( "disabled", false );
      recordApi.recordFile = file.nativeURL;
      mediaApi.pathToPlay = file.nativeURL;
      recordApi.media = new Media(recordApi.recordFile, recordApi.onStop, recordApi.onError, recordApi.onStatus);
    });
  },
  onStop: function(){
    recordApi.media.release();
    mediaApi.load(recordApi.recordFile);
  },
  onError: function(err){
    console.log('Recording error');
    console.log(err);
  },
  onStatus: function(status){
    switch(status) {
      case Media.MEDIA_RUNNING:
        console.log('Status change: running');
        recordApi.isRecording = true;
        recordApi.button.css('background-color','red');
      break;
      case Media.MEDIA_STOPPED:
        console.log('Status change: stopped');
        recordApi.isRecording = false;
        recordApi.button.css('background-color', '#333');
      break;
    }
  },
  record: function(){
    recordApi.button.html('').append('Rec').append($('<br>')).append(
        $('<span style="font-size:40%">').text('(press to stop)')
    );
    recordApi.media.startRecord();
  },
  stop: function(){
    recordApi.button.text('Rec');
    recordApi.media.stopRecord();
  },
}  
*/
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