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
  /*recordApi.initialize();
  mediaApi.initialize();*/
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
	//guias.lista.push(crearGuia());
	//guias.guardarGuias(function(){console.log('se guardaron las guias')});
	entrevistas.initialize();
  });
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