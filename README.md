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
 
[!--lang:en-->

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

### *checklist example*:
- [x] 1. Introduce yourself and tell me why you want to take this course.
- [ ] 2. Name
- [ ] 3. Age
- [ ] 4. Prior knowledge, or taken courses
- [ ] 5. Mobile development experience 
- [ ] 6. General development experience

### Extras
7. There could be string fields to be filled in during the interview 
8. If an item of the checklist is pressed more than once, the program records every time the item was pressed (and shows a check for each time the button was pressed, so as to have a feedback of each press).

## Case 2: Preparing the interview
1. The preparer of the interview (could be the interviewer him/herself or a supervisor) enters every item (specifying the item number, text and type) in the PC or  mobile device
2. He or she saves the *checklist* with a name on the server

## Case 3: Downloading the interview
1. The interviewer connects the device to the network and logs in the server
2. He or she presses the `Transmit` button
3. The program sends the interviews to the server

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

### Ejemplo de *check list*:
- [x] 1. Preséntese y cuénteme por qué quiere hacer el curso de Phonegap
- [ ] 2. Nombre
- [ ] 3. Edad
- [ ] 4. Conocimientos previos, o estudios cursados
- [ ] 5. Experiencia en desarrollo móvil
- [ ] 6. Experiencia en desarrollo en general


### Adicionales
7. Puede haber algunos campos de texto que se puedan llenar durante la entrevista
8. Si un ítem del *check list* se presiona más de una vez el programa registra cada vez que fue presionado 
(y muestra un tilde por cada vez que se presione, de modo de dar *feedback* de cada presión). 

## Caso 2: Preparación de la entrevista
1. El preparador de la entrevista (que puede ser el mismo entrevistador o un supervisor) 
ingresa cada uno de los ítems (especificando número, texto y tipo de ítem) en la PC o en el dispositivo móvil
2. Graba el *check list* con un nombre en el servidor

## Caso 3: Descarga de las entrevistas
1. El entrevistador conecta el dispositivo a la red y se loguea en el servidor
2. Presiona el botón `Transmit`
3. El programa envía las entrevistas al servidor

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
