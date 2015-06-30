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
    recordApi.initialize();
    mediaApi.initialize();
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

var mediaApi = {
  playTime: 0,
  initialize: function() {
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
};

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
      div.append(e);

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
    div.append(e);

    var tags = entrevista.tags.filter(function(tag){
      return tag.ref == i;
    });

    $.each(tags, function(ii,ee){
      div.append( createSeekButton(ee.time) );
    });

    container.append(div);
  });
});
$('#nueva-guia').on('pagecreate', function(){
  console.log('pagecreate on nueva-guia');
  console.log(JSON.stringify(crearGuia()));
  guias.lista.push(crearGuia());
  guias.guardarGuias(function(){console.log('se guardaron las guias')})
});
