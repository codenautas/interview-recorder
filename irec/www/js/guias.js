var guias = {
  lista: [],
  ready: false,
  initialize: function(){
    guias.obtenerGuias(function(err, contents){
      if(err) {
        console.log('Error obteniendo el archivo de guias');
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
    fileApi.writeTextFile('guias.json', guiasEnTexto, function(content){
      callback && callback(content);
    });
  },
  obtenerGuias: function(callback) {
    var onError = function(err) {
      callback && callback(err, null);
    }
    var onFile = function(fileEntry) {
      //convierte el fileEntry en un fileObject
      fileEntry.file(
        function(fileObject){
          var reader = new FileReader();
          // reader.onerror = function(){
          //   console.log('reader error');
          //   console.log(arguments);
          // }
          reader.onloadend = function(){
            // console.log(this.result);
            callback && callback(null, this.result);
          }
          reader.readAsText(fileObject);
        },
        onError
      );
    }
    fileApi.dir.getFile('guias.json', {create:true}, onFile, onError);
  },
  agregarGuia: function(guia, callback){
    guias.lista.push(guia);
    guias.guardarGuias(function(){
      callback && callback();
    });
  }
}