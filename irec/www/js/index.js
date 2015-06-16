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
  
