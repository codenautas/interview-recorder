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
    //inicializaciones dependientes de fileApi

    guias.initialize();
    entrevistas.initialize();
    recordApi.initialize();
    revisionApi.initialize();
    
  });
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
    revisionApi.play();
  });

  $('#pausa').click(function(e){
    e.preventDefault();
    revisionApi.pausa();
  });

  //inicializacion de indicadores de tiempo
  revisionApi.currentTime = $('#currentTime').text("00:00");
  revisionApi.totalTime = $('#totalTime').text(0);
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
  revisionApi.load(pages.toPage.data('entrevistaIdx'));
  $.each(guia.preguntas, function(i,e){
    var div = $('<div class="respuesta" />');
    div.append(revisionApi.createTagButton(i));
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
/*function createSeekButton(time){
  var button = $('<button />')
    .text('Go!')
    .click(function(e){
      console.log('reproducir desde '+time);
    });
  return button;
}
*/
window.addEventListener('error',function(e){
    uglyLog(e.message || ''+e)
    uglyLog(''+e.stack);
});