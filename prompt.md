
bien existen 3 roles 

administrador

el administrador tiene acceso da todo y control de todo 

docente 

administra los temas para los estudiantes
subtemas 
preguntas 
recursos y también se puede ayudar con la ia

puede ver el perfil de cada estudiante 
ver sus proceso de aprendizaje 


estudiante

el estudiante puede ver su dashboard 
su test vark
el contenido para estudiar , los temas , subtemas , 
historial , recomendaciones 


hola vamos a continuar trabajando con nuestro proyecto dale , bien que vamos hacer ?

primero necesito que entres en contexto sobre que tenemos implementado , imagino que ya sabes cuales son los casos de uso cierto tu conectaste el back con front
capas no lo hayas notado pero necesitamos hacer varios arreglos , y para eso necesitamos crearnos planes de las mejoras y lo que falta hacer 

bien para comenzar tenemos 3 roles, los que se mencionan arriba 

ya entre con los 3 tipos de roles y todos me llevan a la misma vista del administrador dale 
entonces tenemos que diferenciar roles para comenzar 

que es lo que debemos ver en cada rol ?

- administrador 

debe poder visualizar cada perfil de cada estudiante y también debe poder visualizar el perfil del docente 
pero aquí lo mas importante es del estudiante ya que este sw sera para estudiante para ayudarlo a mejorar en la materia de programación básica listo
entonces debe poder visualizar el perfil del estudiante ósea prácticamente todo lo que hace cada estudiante, cuando revises el proyecto hay tendrás contexto sobre que es lo que hacemos para hacer mejor la experiencia del estudiante, por ejemplo podemos ver el tiempo que esta en un lugar o sitio web , los clicks en fin ya lo veras cuando revises el proyecto 

ahora el proyecto no tiene no tiene este proceso o actividad 
no podemos ver la lista de estudiantes que existen ni los docentes activos, no podemos ver el de cada estudiante , en fin no esta implementado esta parte 
debemos implementarlo 

el dashboard que existe ahorita, a lo que entiendo parece un dashboard de estudiante , me entiendes muestra todo lo que debería ver el estudiante pero no para un administrador no muestra nada 
no esta implementado un dashboard para modo administrador debemos implementar eso , el dashboard esta perfecto pero debe ser para el rol del estudiante, ahora necesitamos uno para el rol de administrador 

ahora el tesk vark es solo un inicio para evaluar a cada estudiante, que quiere decir 

si un estudiante entra por primera ves a su cuenta el sistema de mostrarle un test vark , para que es esto ?
es para definir el primer nivel o los valores iniciales para la recomendación de los recursos y para el entrenamiento del machine learning 

entonces quien puede editar el tema ?
el test vark lo puede editar solo el administrador , 
ahora ya sabemos que el test vark lo puede editar y hacer el administrador cierto, el administrador puede hacerlo de dos formas esta edición una donde le pida a la ia que el ayude a crear preguntas y opciones , cierto , y el administrador revisa esas preguntas y las valida para colocarlas en el tesk vark 
esa seria una forma de edición
otra seria donde el administrador directamente configura el test vark para que se haga de manera automática para cada estudiante cierto asi no se repetirían las preguntas, el administrador debe poder visualizar una vista previa del test vark realizado y guardarlo
ahora para test vark que hace la ia , supongamos que falla entonces debe haber uno de repuesto para que si o si responda el estudiante cuando se inscriba dale 
bien eso seria por parte del test vark 

bien ahora pasamos a los temas , subtemas, 
esta parte esta bien se entiende que significan estos dos puntos, nosotros sabemos que nuestro sw es un sistema de recomendación de recursos , y para esto necesitamos saber las categorías o subcategorías cierto, entonces para nosotros lo llamamos como temas y subtemas, donde en la parte de recursos y recomendaciones podemos filtrar recursos y recomendaciones cierto en todo caso si esta bien hecho , esto podrá ser gestionado por el docente y el administrador 

ahora pasemos a las preguntas

aquí en las preguntas ahora esta funcionando de manera manual donde cada docente o administrador crea las preguntas para cada tema donde haya estudiado el estudiante cierto , se be bien y funcional , pero ahorita solo esta la parte de la gestion manual cierto, ahora debemos añadir el tema de hacer o crear preguntas con ia, con el objetivo de que supongamos que cada docente o administrador le dicen cambia las preguntas para esta semana entonces el administrador puede cambiarlo de manera manual o con ia 

esa es la forma de como va participar aquí la ia 


bien ahora pasemos a recursos y recomendaciones

ambos puntos están perfectos , deben ser gestionandos por docente y administrador de momento se encuentra bien 


ahora pasemos al tema de la evolución del perfil vark esto debería mostrarse para cada estudiante , esta bien para un rol de estudiante que quiera ver su evolución de perfil vark , pero como administrador yo solo debería un historial 
debería poder verlo pero de cada estudiante , tanto como el administrador y el docente 

después esta todo bien 

ahora pasemos al tema de la configuración del machine learninng 

en donde dice Configuración del motor
exactamente no entiendo bien que hace ni para que sirve ni donde entra el ML dale eso explicarme y verifica es que estamos haciendo uso de ML

la idea que tenia sobre como usar el machine learning era que pueda entrenarse de manera supervisada y no supervisada , mediante las interacciones de cada estudiante es por eso que tenemos los eventos de clickstream y otros eventos mas , ósea esta parte si no la entiendo bien pero si podes indicarme y explicarme como lo vamos a usar o como lo estamos usando , estaría perfecto, igual de todos modos te voy a pasar contexto sobre que trata nuestro proyecto , asi podras ayudarme mejor a que vamos hacer dale 

ahora pasemos al tema del experimento a/b 

no le entiendo bien como lo estamos usando y para que nos sirve esto igual porfa explícame como lo estamos usando y para que nos sirve y revisar si esta trabajando bien 

ahora pasemos al perfil del administrador y del docente y del estudiante, en la esquina superior derecha , tenemos una sección pequeña donde se el perfil cierto , pero creo que no esta siendo utilizado podrías revisar esa parte porfa hay debe poder mostrar el perfil de cualquier rol , me refiero a su nombre , correo contraseña y si tiene foto, y que tenga la opción de editar su  perfil o eliminarlo  bien eso seria

ahora tenemos una ultima sección de notificaciones 
aquí debemos poder ver varios tipo de notificaciones dependiendo del rol 

como ahorita solo vamos a trabajar con administrador hablaremos solo de lo que tiene que ver el administrador 

vemos que nos tenemos una gestion de notificaciones , solo tenemos una sección donde llegan las notificaciones, al administrador , pero somos 3 roles administrador docente y estudiante cierto entonces necesitamos mejorar esa parte configurar notificaciones para cada rol, porque ahorita se que llegan notificaciones a cada rol, pero nadie las a configurado ni nada por el estilo no hay control de eso, y quien va poder gestionar las notificaciones?
solo el administrador nadie mas listo ahora no tengo idea de como lo vamos a gestionar pero tu dame ideas porfa 

bien hasta aquí ya tenemos definido lo que debería hacer un administrador cierto 

bien para el tema de la ia estamos usando apigroq y el tema del machine learning creo que no hemos configurado nada o no lo he visto a detalle eso debemos configurarlo porfa 
para el entrenamiento del machine learning se que necesitamos datos entonces tendrás que prepararme datos sintéticos para el posterior entrenamiento dale 

bien ahora como vemos que es demasiado trabajo necesito que crees planes y lo guardes aquí "C:\Users\HP\Desktop\taller1\proyecto_vark\documentacion"
crea todo el plan no se en cuentos archivos pero la idea es de que podamos ir haciendo las mejoras de a poco para ir probando y continuando con el trabajo listo 

me dijiste que tenias un ayuda memoria pero no se como lo estas interpretando eso podrías explicarme , porque yo pensaba que ibas a crear un .md y guardarlo en alguna parte de este  proyecto 

los archivos de contexto que te pasare son los siguientes, aquí se encuentran las cosas que hemos hecho y lo que esta implementado

casos de uso 

C:\Users\HP\Desktop\taller1\proyecto_vark\casos_de_uso.md

idea de como funciona o debería funcionar si ves algo mejor solo lo arreglas porfa 

C:\Users\HP\Desktop\taller1\varios\innovacion.md

requerimientos esta generalizado si te das cuenta , solo dice lo mas importante pero ya te dije los detalles arriba y es solo del administrador 

C:\Users\HP\Desktop\taller1\documentacion\06_requerimientos_principales.md

bien con ese contexto creo que seria suficiente para crear los planes de como hacer las mejoras del cliente
ahora el tema de las notificaciones usaremos firebase

listo empezemos a trabajar porfa, luego de acabar este trabajo haremos las vistas para el docente y el estudiante de momento solo concentremosno en el administrador 

ah por ultimo el tema del diseño es especial te voy a mostrar la carpeta donde indica como debemos trabajar en el tema del diseño 
"C:\Users\HP\Desktop\taller1\diseño"

hay esta el tema del diseño del frontend con el que hemos estado trabajando dale 

bien la forma de trabajo era la siguiente primero hacíamos el backend que tenga todo lo que necesitamos , luego de terminar con el backend pasábamos al frontend , netamente diseño , para no perderse en el contexto y se enfoque en el diseño, ya de ultimo hacíamos la conexión entre back y frontend listo esa es la forma como vamos a trabajar dale 