var guias = {
  lista: [], // <-- array para tener la lista de guias a mano
  ready: false,
  initialize: function(){
    guias.obtenerGuias(function(err, contents){
      if(err) {
        uglyError('Error obteniendo el archivo de guias',err);
        guias.lista = [];
      }
      if(contents) {
        guias.lista = JSON.parse(contents);
      }else{
        guias.lista.push(crearGuia());
        guias.guardarGuias();
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
};
