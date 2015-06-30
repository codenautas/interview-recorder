var revisionApi = {
  playTime: 0,
  mediaStartDate: 0,
  mediaDuration: 0,
  entrevista: null,
  colorTagPasado: '#84EC61',
  colorTagPendiente: '#f6f6f6',
  isPlaying: false,
  interval: null,
  currentTime: $('#currentTime').text("00:00"),
  reset: function(){
    if(revisionApi.isPlaying) {
      revisionApi.pausa();
    }
    if(revisionApi.audio) {
      revisionApi.audio.release();
    }
    revisionApi.mediaStartDate = 0;
    revisionApi.mediaDuration = 0;
    revisionApi.playTime = 0;
    revisionApi.interval = null;
    revisionApi.audio = null;
    revisionApi.playTime = 0;
    revisionApi.entrevista = null;
    revisionApi.isPlaying = false;
    revisionApi.currentTime.text("00:00");
  },
  initialize: function() {},
  pausa: function() {
    if(!revisionApi.isPlaying) {
      return;
    }
    clearInterval(revisionApi.interval);
    revisionApi.interval = null;
    revisionApi.isPlaying = false;
    revisionApi.audio.pause();
  },
  onUpdate: function() {
    revisionApi.audio.getCurrentPosition(function(t){
      revisionApi.playTime = t;
      revisionApi.currentTime.text( clockFormat(t) );
      console.log(t);
      $('button.tag').each(function(i,e){
        if($(e).data('miliseconds') < t * 1000) {
          $(e).css('background-color',revisionApi.colorTagPasado);
        }
      });
    });
  },
  seek: function(ms) {
    $('button.tag').each(function(i,e){
      if(ms > $(e).data('miliseconds')) {
        $(e).css('background-color',revisionApi.colorTagPasado);
      }else{
        $(e).css('background-color',revisionApi.colorTagPendiente);
      }
    });
    revisionApi.audio.seekTo(ms);
  },
  play: function() {
    if(revisionApi.isPlaying || !revisionApi.audio) {
      return;
    }
    revisionApi.interval = setInterval(revisionApi.onUpdate,500);
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
        $(this).parent().append(revisionApi.createSeekButton(d));
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
    revisionApi.reset();
    revisionApi.entrevista = entrevistas.lista[entrevistaId];
    revisionApi.mediaStartDate = new Date(revisionApi.entrevista.start);
    revisionApi.audio = new Media(revisionApi.entrevista.audioPath, revisionApi.onSuccess, revisionApi.onError, revisionApi.onStatus);
    //fake play
    revisionApi.audio.play();
    console.log('audio file loaded');
  },
  createSeekButton: function(time) {
    var milisecondsFromStart = new Date(time) - revisionApi.mediaStartDate;
    var button = $('<button />')
      .addClass("ui-btn ui-btn-inline ui-mini")
      .addClass('tag')
      .data('miliseconds', milisecondsFromStart)
      .text('Go!')
      .click(function(e){
        console.log('reproducir desde '+time);
        revisionApi.seek(milisecondsFromStart);
      });
    return button;
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
            revisionApi.mediaDuration = revisionApi.audio._duration;
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
    console.log('Error');
    console.log(err);
  }
}

