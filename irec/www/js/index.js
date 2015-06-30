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

$('#guia-list').on('pagecreate', function(){
  //inicializar el boton para crear nuevas guias
  $('a[href="#nueva-guia"]').on('click', function(evt){
    evt.preventDefault();
    var p = prompt("Nombre de la nueva guia","");
    if(!p || !p.trim()) {
      $(':mobile-pagecontainer').pagecontainer('change','#home');
      return false;
    }
    $('#titulo-guia').text(p);
    $(':mobile-pagecontainer').pagecontainer('change','#nueva-guia');
  });
});

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
      .on('taphold', function(evt){
        var p = confirm('Eliminar la guia "'+e.nombre+'"?');
      })
      .click(function(evt){
        evt.preventDefault();
        var p = prompt("Nombre la entrevista","");
        if(!p || !p.trim()) {
          return;
        }
        $('#titulo-entrevista').text(p);
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
