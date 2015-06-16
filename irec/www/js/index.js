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
  console.log('init');
  // Configuracion de JQM para phonegap
  $.mobile.allowCrossDomainPages = true;
  $.support.cors = true;
  $.mobile.buttonMarkup.hoverDelay = 0;
  $.mobile.pushStateEnabled = false;
  $.mobile.defaultPageTransition = "none";
  mediaApi.initialize();
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
  initialize: function() {
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
    console.log('media stop/played/rec success');
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

window.addEventListener('error',function(e){
    var div=document.createElement('div');
    div.textContent=e.message || ''+e;
    document.body.appendChild(div);
    div.textContent+=e.stack;
});