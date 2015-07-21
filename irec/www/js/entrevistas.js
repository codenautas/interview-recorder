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
  },
  obtenerListaDeArchivosDeAudio: function(callback) {
    fileApi.getDir('audio', function(err, dirEntry){
      if(err){
        callback && callback(err, []);
      }
      fileApi.readDir(dirEntry, function(entries){
        callback && callback(null, entries);
      });
    });
  },
  obtenerArchivosDeAudioDeEntrevistas: function(callback) {
    var filePaths = [];
    $.each(entrevistas.lista, function(idx, item){
      filePaths.push(item.audioPath);
    });
    callback(filePaths);
  },
  encontrarArchivosHuerfanos: function(callback) {
    var huerfanos = [];
    entrevistas.obtenerArchivosDeAudioDeEntrevistas(function(paths){
      entrevistas.obtenerListaDeArchivosDeAudio(function(err, files){
        if(err) {
          //si hay error devuelvo el array vacio
          return callback && callback(huerfanos);
        }
        $.each(files, function(i,e){
          // por cada archivo en el directorio
          // buscamos el nativeURL en el array
          // de paths que obtuvimos de las entrevistas
          if(paths.indexOf(e.nativeURL) == -1) {
            // si NO se encuentra
            // es un archivo huerfano
            huerfanos.push(e);
          }
        });
        callback && callback(huerfanos);
      });
    });
  }
}