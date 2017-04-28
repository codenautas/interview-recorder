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
    document.addEventListener('pause', function(){
      recordApi.stop();
      revisionApi.pausa();
    });
    navigator && navigator.splashscreen && navigator.splashscreen.hide();
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
    uglyError('fileApi',err);
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
