  
var revisionApi = {
  playTime: 0,
  initialize: function() {
    //inicializacion de estado de reproduccion
    revisionApi.isPlaying = false;

    //initialize with load
    // revisionApi.load('/android_asset/www/intro.mp3');
    uglyLog('revisionApi ini');
  },
  pausa: function() {
    if(!revisionApi.isPlaying) {
      return;
    }
    clearInterval(revisionApi.interval);
    revisionApi.interval = null;
    revisionApi.isPlaying = false;
    revisionApi.audio.pause();
  },
  play: function() {
    if(revisionApi.isPlaying || !revisionApi.audio) {
      return;
    }
    revisionApi.interval = setInterval(function(){
      revisionApi.audio.getCurrentPosition(function(t){
        revisionApi.playTime = t;
        revisionApi.currentTime.text( clockFormat(t) );
      });
    },500);
    revisionApi.isPlaying = true;
    revisionApi.audio.play();
  },
  createTagButton: function(ref) {
    var button = $('<button />')
      .addClass("ui-btn ui-btn-inline ui-mini")
      .text('+')
      .click(function(e){
        var d = new Date(revisionApi.entrevista.start);
        d.setSeconds(d.getSeconds() + revisionApi.playTime);
        revisionApi.entrevista.tags.push({ref: ref, time: d});
      });
    return button;
  },
  onSuccess: function(){
    if(revisionApi.interval) {
      clearInterval(revisionApi.interval);
      revisionApi.currentTime.text("00:00");
      revisionApi.interval = null;
      revisionApi.isPlaying = false;
    }
    console.log('media stop/played/rec success');
  },
  load: function(entrevistaId) {
    if(revisionApi.isPlaying) {
      revisionApi.pausa();
    }
    if(revisionApi.audio) {
      revisionApi.audio.release();
    }
    revisionApi.entrevista = entrevistas.lista[entrevistaId];
    revisionApi.audio = new Media(revisionApi.entrevista.audioPath, revisionApi.onSuccess, revisionApi.onError, revisionApi.onStatus);
    //fake play
    revisionApi.audio.play();
    console.log('audio file loaded');
  },
  onStatus: function(status) {
    switch(status) {
      case Media.MEDIA_NONE: console.log('Status change: idle');
      break;
      case Media.MEDIA_STARTING:
        console.log('Status change: starting');
      break;
      case Media.MEDIA_RUNNING:
        console.log('Status change: running');
        if(!revisionApi.audio.initialized) {
          revisionApi.audio.getCurrentPosition(function(){
            console.log(revisionApi.audio._duration);
            revisionApi.totalTime.text( clockFormat(revisionApi.audio._duration) );
            revisionApi.audio.stop();
            revisionApi.audio.initialized = true;
          });
        }
      break;
      case Media.MEDIA_PAUSED: console.log('Status change: paused');
      break;
      case Media.MEDIA_STOPPED: console.log('Status change: stopped');
      break;
      default: console.log('unknown status');
    }
  },
  onError: function(err) {
    uglyError('revisionApi.Error',err);
  }
};
