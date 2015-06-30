var recordApi = {
  initialize: function(callback){
    //referencia al boton
    recordApi.button = $('#record');

    //referencia al reloj
    recordApi.clock = $('#record-time');

    //inicializar estado
    recordApi.isRecording = false;

    //inicializar variable para el interval
    recordApi.interval = null;

    //referencia al directorio "audio"
    fileApi.getDir('audio', function(err, dir){
      if(err) {
        console.log(err);
        return;
      }
      recordApi.audioDir = dir;
      callback && callback();
    });
  },
  nuevaGrabacion: function(guiaId, callback){
    var fileName = guid();
    var onError = function(err) {
      callback && callback(err, null);
    }
    var onFile = function(fileEntry) {
      recordApi.entrevista = {
        id: fileName,
        nombre: $('#titulo-entrevista').text(),
        audioPath: fileEntry.nativeURL,
        interview: guiaId,
        start: null,
        stop: null,
        tags: []
      };
      recordApi.recordFile = fileEntry.nativeURL;
      callback && callback(null, fileEntry);
    }
    recordApi.audioDir.getFile(fileName, {create:true}, onFile, onError);
  },
  tildeContestado: function(){
    var mark = $('<div />')
      .addClass("ui-input-btn ui-btn ui-btn-inline ui-icon-check ui-btn-icon-notext ui-corner-all")
      .css("float","right")
      .text(" ");
    return mark;
  },
  createTagButton: function(ref) {
    var button = $('<button />')
      .addClass("ui-btn ui-btn-inline ui-mini")
      .text('+')
      .click(function(e){
        if(!recordApi.isRecording) {
          return;
        }
        console.log('tag ' + ref + ' @ ' + new Date());
        $(this).parent().append(recordApi.tildeContestado());
        recordApi.entrevista.tags.push({ref: ref, time: new Date()});
      });
    return button;
  },
  updateClock: function(){
    var recordTime = ((new Date() - recordApi.entrevista.start) / 1000) << 0;
    recordApi.clock.text(clockFormat(recordTime));
  },
  record: function(){
    recordApi.media = new Media(recordApi.recordFile, recordApi.onStop, recordApi.onError, recordApi.onStatus);
    recordApi.media.startRecord();
  },
  stop: function(){
    recordApi.media.stopRecord();
  },
  onStop: function(){
    console.log('recordApi.onStop');
    $.mobile.loading('show');
    recordApi.media.release();
    recordApi.media = null;
    recordApi.entrevista.stop = new Date();
    entrevistas.agregar(recordApi.entrevista, function(entrevista){
      //falta nombre de la revision
      $('#revision').data('entrevistaIdx',entrevistas.lista.length - 1);
      $(':mobile-pagecontainer').pagecontainer('change','#revision');
    });
  },
  onError: function(err){
    console.log('Recording error');
    console.log(err);
  },
  onStatus: function(status){
    switch(status) {
      case Media.MEDIA_NONE: console.log('Status change: idle');
      break;
      case Media.MEDIA_STARTING:
        console.log('Status change: starting');
      break;
      case Media.MEDIA_RUNNING:
        console.log('Status change: running');
        recordApi.interval = setInterval(recordApi.updateClock,500);
        recordApi.isRecording = true;
        recordApi.entrevista.start = new Date();
        recordApi.button.css('background-color','red');
        recordApi.button.text('Detener');
        $.mobile.loading('hide');
      break;
      case Media.MEDIA_PAUSED: console.log('Status change: paused');
      break;
      case Media.MEDIA_STOPPED:
        console.log('Status change: stopped');
        clearInterval(recordApi.interval);
        recordApi.interval = null;
        recordApi.isRecording = false;
        recordApi.button.css('background-color', '#333');
        recordApi.button.text('Grabar');
      break;
      default: console.log('unknown status');
    }
  }
}