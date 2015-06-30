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
      1: "Nombre",
      2: "Edad",
      3: "Sexo",
      4: "Estado civil",
      5: "Sobrenombre"
    }
  };
  return guia;
}