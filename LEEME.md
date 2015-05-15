<!-- multilang from README.md




NO MODIFIQUE ESTE ARCHIVO. FUE GENERADO AUTOMÁTICAMENTE POR multilang.js




-->
# interview-recorder

Interview recorder - guided interview, simultaneous labeling


![training](https://img.shields.io/badge/intended-training-blue.svg)
![stability](https://img.shields.io/badge/stability-designing-red.svg)
[![version](https://img.shields.io/npm/v/interview-recorder.svg)](https://npmjs.org/package/interview-recorder)

<!--multilang buttons-->

idioma: ![castellano](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)
también disponible en:
[![inglés](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)](README.md)


Grabador de entrevistas


# Características
 * graba audio; puede pausar la grabación y reanuadar las veces que sea necesario
 * entrevista guiada por un *check list* de temas o preguntas
 * registra el momento en que se hace cada check durante la grabación
 * descarga tanto el audio como el archivo que contiene los registros de los tags
 

# Objetivo principal

Este proyecto tiene como objetivo principal ser el trabajo práctico final integrador de un curso de Phonegap. 
Las características, definiciones funcionales y decisiones de diseño en general estarán supeditadas a ese objetivo.


![examples](https://raw.githubusercontent.com/codenautas/interview-recorder/master/doc/screens.png)


# Casos de uso

Para facilitar se usará como ejemplo una entrevista de admisión a un curso de Phonegap.

El entrevistador conoce la lista de temas/preguntas del check list. 

El check list cabe en una pantalla de iPad o en un celular con letra muy pequeña

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


### Formato del archivo de registro del *check list*

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


# Licencia

[MIT](LICENSE)

.............................

