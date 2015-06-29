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
    recordApi.initialize();
    mediaApi.initialize();
  });
}

var fileApi = {
  ready: false, // <--solo por las dudas
  initialize: function(callback){
    uglyLog('en fileApi');
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
      }else{
        guias.lista.push(crearGuia());
        guias.guardarGuias(function(){console.log('se guardaron las guias')});
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
var recordApi = {
  initialize: function(callback){
     uglyLog('en recordApi');
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
}
var mediaApi = {
  playTime: 0,
  initialize: function() {
    uglyLog('en mediaApi');
    //inicializacion de estado de reproduccion
    mediaApi.isPlaying = false;

    //initialize with load
    // mediaApi.load('/android_asset/www/intro.mp3');
  },
  pausa: function() {
    if(!mediaApi.isPlaying) {
      return;
    }
    clearInterval(mediaApi.interval);
    mediaApi.interval = null;
    mediaApi.isPlaying = false;
    mediaApi.audio.pause();
  },
  play: function() {
    if(mediaApi.isPlaying || !mediaApi.audio) {
      return;
    }
    mediaApi.interval = setInterval(function(){
      mediaApi.audio.getCurrentPosition(function(t){
        mediaApi.playTime = t;
        mediaApi.currentTime.text( clockFormat(t) );
      });
    },500);
    mediaApi.isPlaying = true;
    mediaApi.audio.play();
  },
  createTagButton: function(ref) {
    var button = $('<button />')
      .addClass("ui-btn ui-btn-inline ui-mini")
      .text('+')
      .click(function(e){
        var d = new Date(mediaApi.entrevista.start);
        d.setSeconds(d.getSeconds() + mediaApi.playTime);
        mediaApi.entrevista.tags.push({ref: ref, time: d});
      });
    return button;
  },
  onSuccess: function(){
    if(mediaApi.interval) {
      clearInterval(mediaApi.interval);
      mediaApi.currentTime.text("00:00");
      mediaApi.interval = null;
      mediaApi.isPlaying = false;
    }
    console.log('media stop/played/rec success');
  },
  load: function(entrevistaId) {
    if(mediaApi.isPlaying) {
      mediaApi.pausa();
    }
    if(mediaApi.audio) {
      mediaApi.audio.release();
    }
    mediaApi.entrevista = entrevistas.lista[entrevistaId];
    mediaApi.audio = new Media(mediaApi.entrevista.audioPath, mediaApi.onSuccess, mediaApi.onError, mediaApi.onStatus);
    //fake play
    mediaApi.audio.play();
    console.log('audio file loaded');
  },
  onStatus: function(status) {
    switch(status) {
      case Media.MEDIA_NONE: console.log('Status change: idle');
      break;
      case Media.MEDIA_STARTING:
        console.log('Status change: starting');
      break;
      case Media.MEDIA_RUNNING:
        console.log('Status change: running');
        if(!mediaApi.audio.initialized) {
          mediaApi.audio.getCurrentPosition(function(){
            console.log(mediaApi.audio._duration);
            mediaApi.totalTime.text( clockFormat(mediaApi.audio._duration) );
            mediaApi.audio.stop();
            mediaApi.audio.initialized = true;
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
  }
}
$('#guia-list').on('pageshow', function(e, pages){
  console.log('pageshow en guia-list');
  var container = $('#guias', pages.toPage);
  container.empty();
  $.each(guias.lista, function(i,e){
    var stringData = JSON.stringify(e);
    var li = $('<li />').appendTo(container);
    var a = $('<a />')
      .attr('href','#interview')
      .data('guia',e)
      .text(e.nombre)
      .appendTo(li)
      .click(function(evt){
        evt.preventDefault();
        $('#interview').data('guia',e);
        $(':mobile-pagecontainer').pagecontainer('change','#interview');
      });
  });
  container.listview('refresh');
});

$('#entrevista-list').on('pageshow', function(e, pages){
  console.log('pageshow en entrevista-list');
  var container = $('#entrevistas', pages.toPage);
  container.empty();
  $.each(entrevistas.lista, function(i,e){
    var stringData = JSON.stringify(e);
    var li = $('<li />').appendTo(container);
    var a = $('<a />')
      .attr('href','#revision')
      .text(e.id)
      .appendTo(li)
      .click(function(evt){
        evt.preventDefault();
        //esta vez pasamos el indice de la entrevista
        $('#revision').data('entrevistaIdx',i);
        $(':mobile-pagecontainer').pagecontainer('change','#revision');
      });
  });
  container.listview('refresh');
});

$('#interview').on('pagecreate', function(){
  console.log('pagecreate on interview');

  $('#record').click(function(e){
    e.preventDefault();
    if(recordApi.isRecording) {
      recordApi.stop();
    }else{
      recordApi.record();
    }
  });
});
$('#interview').on('pageshow', function(e, pages){
  // console.log(e);
  // console.log(pages);
  console.log('pageshow on interview');
  var guia = pages.toPage.data('guia');
  var container = $('#guia', pages.toPage);
  container.empty();
  recordApi.nuevaGrabacion(guia.id, function(){
    $.each(guia.preguntas, function(i,e){
      var div = $('<div class="respuesta" />');
      div.append(recordApi.createTagButton(i));
      div.append(e.texto);

      container.append(div);
    });
  });
});

$('#revision').on('pagecreate', function(){
  console.log('pagecreate on revision');

  //inicializacion de botones
  $('#play').click(function(e) {
    e.preventDefault();
    mediaApi.play();
  });

  $('#pausa').click(function(e){
    e.preventDefault();
    mediaApi.pausa();
  });

  //inicializacion de indicadores de tiempo
  mediaApi.currentTime = $('#currentTime').text("00:00");
  mediaApi.totalTime = $('#totalTime').text(0);
});
$('#revision').on('pageshow', function(e, pages){
  console.log('pageshow en #revision');

  // var entrevista = crearEntrevista(); <-- asi lo teniamos antes
  var entrevista = entrevistas.lista[pages.toPage.data('entrevistaIdx')];
  var guia = guias.lista.filter(function(g){
    return g.id == entrevista.interview;
  })[0];
  var container = $('div#respuestas', pages.toPage);
  container.empty();
  mediaApi.load(pages.toPage.data('entrevistaIdx'));
  $.each(guia.preguntas, function(i,e){
    var div = $('<div class="respuesta" />');
    div.append(mediaApi.createTagButton(i));
    div.append(e.texto);

    var tags = entrevista.tags.filter(function(tag){
      return tag.ref == i;
    });

    $.each(tags, function(ii,ee){
      div.append( createSeekButton(ee.time) );
    });

    container.append(div);
  });
});


/*
function crearGuia() {
  var entrevista = {
    nombre: 'Curso Phonegap',
    id: guid(),
    preguntas: {
      1: "Preséntese y cuénteme por qué quiere hacer el curso de Phonegap",
      2: "Nombre",
      3: "Edad",
      4: "Conocimientos previos",
      5: "Experiencia en mobile",
      6: "Experiencia general"
    }
  };
  return entrevista;
}
*/
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

function createSeekButton(time){
  var button = $('<button />')
    .text('Go!')
    .click(function(e){
      console.log('reproducir desde '+time);
    });
  return button;
}

/*
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

window.addEventListener('error',function(e){
    uglyLog(e.message || ''+e)
    uglyLog(''+e.stack);
});