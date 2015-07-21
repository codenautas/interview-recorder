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


// $.when(jqmReady, documentReady).then(init);
$.when(deviceReady, jqmReady, documentReady).then(init);

function init(){
  console.log('init');
  // Configuracion de JQM para phonegap
  $.mobile.allowCrossDomainPages = true;
  $.support.cors = true;
  $.mobile.buttonMarkup.hoverDelay = 0;
  $.mobile.pushStateEnabled = false;
  $.mobile.defaultPageTransition = "none";

  document.addEventListener('backbutton', function(){
    console.log('android back button tapped');
    console.log(arguments);
    return false;
  }, false);


  fileApi.initialize(function(err, apiRef){
    if(err) {
      console.log('file api error');
      console.log(err);
      return;
    }

    guias.initialize();
    entrevistas.initialize();

    recordApi.initialize();

    document.addEventListener('pause', function(){
      recordApi.stop();
      revisionApi.stop();
    });


    navigator && navigator.splashscreen && navigator.splashscreen.hide();
  });
}


$('#home').on('pagecreate', function(){
  $('#limpiarHuerfanos').on('click', function(evt){
    evt.preventDefault();
    $.mobile.loading('show');
    entrevistas.encontrarArchivosHuerfanos(function(archivos){
      var cantidad = archivos.length;
      $.each(archivos, function(i,e){
        e.remove();
      });
      alert('Se eliminaron '+cantidad+' archivos huerfanos');
      $.mobile.loading('hide');
    });
  });
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
      .text(e.nombre)
      .appendTo(li)
      .on('taphold', function(evt){
        var p = confirm('Eliminar la entrevista "'+e.nombre+'"?');
      })
      .click(function(evt){
        evt.preventDefault();
        //esta vez pasamos el indice de la entrevista
        $('#revision').data('entrevistaIdx',i);
        $(':mobile-pagecontainer').pagecontainer('change','#revision');
      });
  });
  container.listview('refresh');
});


$('#interview').on('pagecreate', function(e){
  console.log('pagecreate on interview');

  $('a[href="#home"]', e.currentTarget).on('click',function(evt){
    if(recordApi.isRecording) {
      evt.preventDefault();
      recordApi.stop();
    }
  });

  $('#record').click(function(evt){
    evt.preventDefault();
    if(recordApi.isRecording) {
      recordApi.stop();
    }else{
      recordApi.record();
    }
  });
});

$('#interview').on('pageshow', function(e, pages){
  // console.log(e);
  $.mobile.loading('show');
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
    $.mobile.loading('hide');
  });
});


$('#revision').on('pagecreate', function(evt){
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

  $('#stop').on('click', function(e){
    e.preventDefault();
    revisionApi.stop();
  });

  $('#backTen').click(function(e){
    e.preventDefault();
    revisionApi.volver10();
  });

  $('a[href="#home"]', evt.currentTarget).on('click',function(e){
    e.preventDefault();
    $.mobile.loading('show');
    if(revisionApi.isPlaying) {
      revisionApi.stop();
    }
    if(revisionApi.dirty) {
      var r = confirm('Hay cambios sin guardar en la entrevista, desea guardarlos?');
      if(r) {
        entrevistas.guardarEntrevistas(function(){
          revisionApi.reset();
          $.mobile.navigate('#home');
          $.mobile.loading('hide');
        });
      }else{
        entrevistas.initialize();
        revisionApi.reset();
        $.mobile.navigate('#home');
        $.mobile.loading('hide');
      }
    }else{
      revisionApi.reset();
      $.mobile.navigate('#home');
      $.mobile.loading('hide');
    }

  });


  //inicializacion de indicadores de tiempo
  revisionApi.currentTime = $('#currentTime').text("00:00");
  revisionApi.totalTime = $('#totalTime').text(0);
});

$('#revision').on('pageshow', function(e, pages){
  console.log('pageshow en #revision');

  // var entrevista = crearEntrevista();
  var entrevista = entrevistas.lista[pages.toPage.data('entrevistaIdx')];
  var guia = guias.lista.filter(function(g){
    return g.id == entrevista.interview;
  })[0];
  $('#titulo-entrevista').text(entrevista.nombre);
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
      div.append( revisionApi.createSeekButton(ee.time) );
    });

    container.append(div);
  });
  $.mobile.loading('hide');
});


$('#nueva-guia').on('pagecreate', function(){
  console.log('pagecreate on nueva-guia');
  $( "#preguntas" ).sortable({
    axis: 'y'
  });
  $( "#preguntas" ).disableSelection();

  $( "#preguntas" ).on("sortstop", function(event, ui) {
    $('#preguntas').listview('refresh');
  });

  // $('ul#preguntas li').on('click', 'a', function(evt){
  //   console.log(this);
  // });

  $('#guardar-guia').on('click', function(evt){
    evt.preventDefault();
    if(!$('#titulo-guia').text() || $('li.pregunta').length < 1) {
      alert('Hay un error en la guia');
      return;
    }
    $.mobile.loading('show');
    var guia = {
      nombre: $('#titulo-guia').text(),
      id: guid(),
      preguntas: {}
    };
    $('#preguntas li').each(function(i,e){
      console.log( $(e).children().first().text() );
      guia.preguntas[i+1] = $(e).children().first().text()
    });
    guias.agregarGuia(guia, function(){
      $.mobile.loading('hide');
      $(':mobile-pagecontainer').pagecontainer('change','#guia-list');
    });
  });
  $('#agregarPregunta').on('click', function(evt){
    evt.preventDefault();
    if($('#preguntaInput').val()) {
      var li = $('<li />')
        .attr('data-icon','delete')
        .addClass('pregunta');
      var a = $('<a href="#" />')
        .text($('#preguntaInput').val())
        .click(function(evt2){
          evt2.preventDefault();
          $(this).parent().remove();
          $('body').focus(); //<- para que no caiga el focus directo en el input
        })
        .appendTo(li);
      $('#preguntas').append(li);
      $('#preguntas').listview('refresh');
      $('#preguntaInput').val('').focus();
    }
  });
});

$('#nueva-guia').on('pageshow', function(e, pages){
  $('#preguntaInput').val("");
  $('#preguntas').empty();
  $('#preguntas').listview('refresh');
});







