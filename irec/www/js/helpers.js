function clockFormat(secs) {
  secs = secs << 0;
  var minutes = (secs / 60) << 0;
  var seconds = secs % 60;
  minutes = minutes < 10 ? "0"+minutes : minutes;
  seconds = seconds < 10 ? "0"+seconds : seconds;
  return minutes+":"+seconds;
}

//RFC4122
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function crearGuia() {
  var guia = {
    nombre: 'Ejemplo',
    id: guid(),
    preguntas: {
      1: {texto: "Nombre"},
      2: {texto: "Edad"},
      3: {texto: "Sexo"},
      4: {texto: "Estado civil"},
      5: {texto: "Sobrenombre"}
    }
  };
  return guia;
}

function crearEntrevistaEjemplo(){
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

// function getRecordFile(callback) {
//   var root = cordova.file.externalDataDirectory;
//   window.resolveLocalFileSystemURL(root, function(rootDir){
//     console.log(rootDir);
//     rootDir.getDirectory('audio', {create:true}, function(dir) {
//       console.log(dir);
//       dir.getFile('record.amr', {create:true}, function(file){
//         console.log(file);
//         callback(file.nativeURL);
//       }, mediaApi.onError);
//     }, mediaApi.onError);
//   }, mediaApi.onError);
// }
