
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

var entrevistas = {
  lista: [],
  ready: false,
  initialize: function(){
    entrevistas.obtenerEntrevistas(function(err, contents){
      if(err) {
        uglyError('Error obteniendo el archivo de entrevistas',err);
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
      uglyLog('entrevista agregada y guardada');
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
