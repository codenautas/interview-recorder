# interview-recorder

Interview recorder - guided interview, simultaneous labeling

<!--multilang v0 en:README.md es:LEEME.md-->

![training](https://img.shields.io/badge/intended-training-blue.svg)
![stability](https://img.shields.io/badge/stability-designing-red.svg)
[![version](https://img.shields.io/npm/v/interview-recorder.svg)](https://npmjs.org/package/interview-recorder)

<!--multilang buttons-->

language: ![English](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)
also available in:
[![Spanish](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)](LEEME.md)

<!--lang:es--]

Grabador de entrevistas

[!--lang:en-->

# Features
 * voice recorder; pause/resume, stop 
 * contains checklist of topics/questions
 * saves the record with each check in a file
 * downloads the audio and file

<!--lang:es--]

# Características
 * graba audio; puede pausar la grabación y reanuadar las veces que sea necesario
 * entrevista guiada por un *check list* de temas o preguntas
 * registra el momento en que se hace cada check durante la grabación
 * descarga tanto el audio como el archivo que contiene los registros de los tags
 
[!--lang:en-->

# Main goal

This project's main objective is to be the final development of a Phonegap course.

<!--lang:es--]

# Objetivo principal

Este proyecto tiene como objetivo principal ser el trabajo práctico final integrador de un curso de Phonegap. 
Las características, definiciones funcionales y decisiones de diseño en general estarán supeditadas a ese objetivo.

[!--lang:*-->

![examples](https://raw.githubusercontent.com/codenautas/interview-recorder/master/doc/screens.png)

<!--lang:en-->

# Use cases

All of the use cases are based on this example: 
***We are doing admission interview to a Phonegap course***

We assume that the interviewer is familiar with the checklist. 

The checklist fits in one window in an iPad (or a phone with small font size). 

<!--lang:es--]

# Casos de uso

Para facilitar se usará como ejemplo una entrevista de admisión a un curso de Phonegap.

El entrevistador conoce la lista de temas/preguntas del check list. 

El check list cabe en una pantalla de iPad o en un celular con letra muy pequeña

[!--lang:en-->

## Case 1: Interview in progress
1. The interviewer presses `Start`,
2. He reads the first item in the checklist: *Introduce yourself and say why you want to take this course*.
3. He presses de check box of that item.
4. He listens the answer of the interviewee. 
If the interviewee says something about any of the items in the checklist, 
the interviewer presses the appropriate check box. 
5. When the interviewee stops the speech, the interviewer reads the first unchecked item in the check list.
6. This is repeated until there is no unchecked items
or until the interviewer considers that the interview must be terminated.

<!--lang:es--]
## Caso 1: Desarrollo de la entrevista
1. El entrevistador presiona `Start` en la pantalla del dispositivo móvil. 
2. Lee el primer ítem del *check list*: *"Preséntese y cuénteme por qué quiere hacer el curso de Phonegap"*.
3. Presiona el tilde del ítem correspondiente en el *check list*.
4. Escucha lo que dice el entrevistado 
y, cada vez que este toca algún tema mencionado en algún ítem del *check list*,
presiona el tilde correspondiente.
5. Cuando el entrevistado deja de hablar el entrevistador lee el primer ítem que todavía no haya sido tildado
6. Esto se repite hasta que no haya ítems sin tildar 
o hasta que el entrevistador considere que ha de darse por terminada la entrevista.

[!--lang:en-->

### *checklist example*:
- [x] 1. Introduce yourself and tell me why you want to take this course.
- [ ] 2. Name
- [ ] 3. Age
- [ ] 4. Prior knowledge, or taken courses
- [ ] 5. Mobile development experience 
- [ ] 6. General development experience

<!--lang:es--]
### Ejemplo de *check list*:
- [x] 1. Preséntese y cuénteme por qué quiere hacer el curso de Phonegap
- [ ] 2. Nombre
- [ ] 3. Edad
- [ ] 4. Conocimientos previos, o estudios cursados
- [ ] 5. Experiencia en desarrollo móvil
- [ ] 6. Experiencia en desarrollo en general

[!--lang:en-->

### Extras
7. There could be string fields to be filled in during the interview 
8. If an item of the checklist is pressed more than once, the program records every time the item was pressed (and shows a check for each time the button was pressed, so as to have a feedback of each press).

<!--lang:es--]
### Adicionales
7. Puede haber algunos campos de texto que se puedan llenar durante la entrevista
8. Si un ítem del *check list* se presiona más de una vez el programa registra cada vez que fue presionado 
(y muestra un tilde por cada vez que se presione, de modo de dar *feedback* de cada presión). 

[!--lang:en-->

## Case 2: Preparing the interview
1. The preparer of the interview (could be the interviewer him/herself or a supervisor) enters every item (specifying the item number, text and type) in the PC or  mobile device
2. He or she saves the *checklist* with a name on the server

<!--lang:es--]
## Caso 2: Preparación de la entrevista
1. El preparador de la entrevista (que puede ser el mismo entrevistador o un supervisor) 
ingresa cada uno de los ítems (especificando número, texto y tipo de ítem) en la PC o en el dispositivo móvil
2. Graba el *check list* con un nombre en el servidor

[!--lang:en-->
## Case 3: Downloading the interview
1. The interviewer connects the device to the network and logs in the server
2. He or she presses the `Transmit` button
3. The program sends the interviews to the server

<!--lang:es--]
## Caso 3: Descarga de las entrevistas
1. El entrevistador conecta el dispositivo a la red y se loguea en el servidor
2. Presiona el botón `Transmit`
3. El programa envía las entrevistas al servidor

[!--lang:en-->
## Case 4: Cheking over the records
1. The interviewer presses `Review` button
2. The program displays
  1. `Play`, `Pause`, `Stop` and `Rewind 10'` buttons
  2. The timeline representing the record with a 0:00 in the beginning and a xx:xx at the end and buttons with the 
  numbers of items checked on the timeline when the button was pressed 
  3. Timeline playhead
  4. Dark grey items that were not pressed
  5. Bright colours for the items that were pressed
  6. Availability of the checks of all of the items
  7. A couple of generic buttons: `Delete 1 tag`, `Delete many tags`
3. The interviewer presses `Play` and the voice record starts (and `Pause` and again `Play` every time it is needed)
4. A `Go` button that can be pressed to hear a particular item that was pressed during the interview
5. The record can be rewind or fast forward moving the timeline playhead
6. The `Review 10'` could be used for rewining 10 seconds and the records starts playing from that point 
(no need of `Play` button to be pressed again)
7. Checks could be added by pressing the proper *check box*
8. `Delete tags` buttons are pressed to delete a tag and red crosses display on `Go` buttons for deleting the tag by pressing the cross.
`Delete tag` button vanishes crosses after the first delete,
`Delete many tags` button allows to delete several tags simultaneously.
In both cases, an orange `Stop` button displays, crosses can be deleted by pressing this button

<!--lang:es--]

## Caso 4: Revisar lo grabado
1. El entrevistador presiona el botón `Review`
2. El programa muestra 
  1. el botón `Play`, `Pause`, `Stop` y `Rewind 10'`
  2. la línea de tiempo que representa la grabación con un 0:00 al comenzar y un XX:XX al terminar y botones con los números de ítems señalando sobre la recta los lugares donde se presionó cada ítem
  3. Un indicador de avance/desplazamiento sobre la barra de tiempo
  4. oscurecidos los ítems que no han sido presionados 
  5. brillantes los ítems que han sido presionados (con un botón de `Go` por cada vez que se presionaron). 
  6. habilitados los tildes de todos los ítems
  7. un par de botones genéricos `Delete 1 tag`, `Delete many tags`
3. El entrevisitador presiona `Play` y empieza a escuchar (y `Pause` y de nuevo `Play` cada vez que lo necesite)
4. Cuando quiere escuchar en qué lugar tildó cierto ítem durante la entrevista presiona el botón `Go`, 
el programa posiciona el audio en ese punto y empieza a emitirlo
5. Puede cambiar de lugar la reproducción moviendo el indicador de avance/desplazamiento
6. Si quiere retroceder puede usar el botón `Review 10'` que retrocede 10 segundos y reproduce desde ahí 
(o sea no se necesita poner `Play` otra vez)
7. Si quiere puede agregar tildes presionando el *check box* correspondiente 
(y el programa agrega el botón `Go` y el botón con el número de ítem sobre la línea de tiempo)
8. Si quiere borrar un tag presiona alguno de los botones `Delete tags` y aparecen cruces rojas sobre los botones `Go` para borrarlos presionando las cruces. 
El botón `Delete tag` hace desaparecer las cruces al primer borrado, 
el botón `Delete many tags` permite borrar varios a la vez.
En ambos casos aparece un botón naranja `Stop`, presionando ese botón también desaparecen las cruces de borrado. 

[!--lang:en-->

### Register File Format

<!--lang:es--]

### Formato del archivo de registro del *check list*

[!--lang:*-->
```yaml
interview: 34
start: 2001-12-14T21:59:43.10-03:00
tags:
  - [1, 2001-12-14T22:00:18.15-03:00]
  - [5, 2001-12-14T22:03:21.33-03:00]
  - [2, 2001-12-14T22:04:02.22-03:00]
  - [3, 2001-12-14T22:04:02.43-03:00]
  - [5, 2001-12-14T22:07:41.56-03:00]
stop: 2001-12-14T22:11:02.35-03:00
```

<!--lang:en-->

# Licence

[MIT](LICENSE)

<!--lang:es--]

# Licencia

[MIT](LICENSE)

.............................

[!--lang:*-->
