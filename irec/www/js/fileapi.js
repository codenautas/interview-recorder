var fileApi = {
  ready: false,
  initialize: function(callback){
    var path = cordova.file.externalDataDirectory;
    var onResolve = function(directoryEntry) {
      fileApi.dir = directoryEntry;
      fileApi.ready = true;
      callback && callback(null, fileApi);
    }
    var onError = function(err){
      callback && callback(err, fileApi);
    }
    window.resolveLocalFileSystemURL(path, onResolve, onError);
  },
  readDir: function(directoryEntry, callback) {
    directoryEntry.createReader().readEntries(callback);
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
  // createEmptyFile: function(fileName, callback) {
  //   var onFile = function(fileEntry) {
  //     fileEntry.createWriter(function(fileWriter){
  //       fileWriter.write();
  //       callback && callback(fileEntry);
  //     }, fileApi.onError);
  //   }
  //   fileApi.dir.getFile(fileName, {create:true}, onFile, fileApi.onError);
  // },
  readTextFile: function(file, callback) {
    var onFile = function(fileEntry) {
      //convierte el fileEntry en un fileObject
      fileEntry.file(function(fileObject){
        var reader = new FileReader();
        reader.onloadend = function(){
          console.log(this.result);
          callback && callback(this.result);
        }
        reader.readAsText(fileObject);
      });
    }
    fileApi.dir.getFile(file, {create:false}, onFile, fileApi.onError);
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
  },
  // getFile: function(file, callback) {
  //   fileApi.dir.getFile(file, {create:false}, callback, fileApi.onError);
  // }
}

