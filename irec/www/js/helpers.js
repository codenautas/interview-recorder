function crearGuia() {
  var entrevista = {
    nombre: 'Curso Phonegap',
	id: guid(),
    preguntas: {
      1: {texto: "Preséntese y cuénteme por qué quiere hacer el curso de Phonegap"},
      2: {texto: "Nombre"},
      3: {texto: "Edad"},
      4: {texto: "Conocimientos previos"},
      5: {texto: "Experiencia en mobile"},
      6: {texto: "Experiencia general"}
    }
  };
  return entrevista;
}
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
function clockFormat(secs) {
  secs = secs << 0;
  var minutes = (secs / 60) << 0;
  var seconds = secs % 60;
  minutes = minutes < 10 ? "0"+minutes : minutes;
  seconds = seconds < 10 ? "0"+seconds : seconds;
  return minutes+":"+seconds;
}
function uglyLog(message){
    console.log(message);
    if($){
        $('[data-role=footer]').append(
            $('<p>').text(message).addClass('uglylog').click(function(){
                $('.uglylog').remove();
            })
        );
    }else{
        var div=document.getElementById('uglyLog');
        if(!div){
            div=document.createElement('div');
            div.id='uglyLog';
            document.body.appendChild(div);
        }
        div.textContent=(div.textContent||'') + message+'. ';
        return div;
    }
}