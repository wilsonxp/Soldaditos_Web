
//**** INICIALIZACION DE VARIABLES ****
var cantComments = 3;
var entries = null;
var d = 0;
var h = cantComments;
var bandera = 0;

$(document).ready(function() {

  //**** CIERRA AVISO NAVEGADOR VIEJO ****
  $(".cierraAviso").click(function() {
    $("#actualizaNav").animate({height: '0px'},800, function() {
      $("#actualizaNav").css('display','none');
    });
  });

  //**** ABRE Y CIERRA SOCIAL ****
  $("#openSocial").click(function() {
    $("#comments").slideToggle("slow");
    $("#twitter_update_list").slideToggle("slow");
    if(bandera==0) {
      $("#openSocial img#flecha").attr("src","imagenes/arrow_up.png");
      bandera = 1;
      $(".cargarMasMenos").fadeIn(500);
    } else {
      $("#openSocial img#flecha").attr("src","imagenes/arrow_down.png");
      bandera = 0;
      $(".cargarMasMenos").fadeOut(300);
    }
  });

  //**** ABRE Y CIERRA LEITMOTIV ****
  $("#descripcion span.abreDescargar").click(function(){
    if(!$(this).hasClass("clicked")) {
      $(this).addClass("clicked");
      $("#leitmotiv").animate({height: '288px'},1000, function() {
        $("#leitmotivCerrar").fadeIn(200);
      });
      $("#leitmotivColor").animate({height: '288px', opacity: '1'},1000);
      $("#leitmotivContenido").animate({top: '-288px', height: '255px'},1000);
      //$("#leitmotivColor").animate({opacity: '1'},1000);
      $("#titulos").animate({fontSize: '+=.5em'},1000);
      $("#botonesDescarga").fadeIn(1000);
    }
  });

  $("#leitmotivCerrar").click(function(){
    $("#descripcion span.abreDescargar").removeClass('clicked');
    $("#leitmotivCerrar").fadeOut(200, function() {
      $("#botonesDescarga").fadeOut(1000);
      $("#titulos").animate({fontSize: '-=.5em'},1000);
      $("#leitmotivContenido").animate({top: '-96px', height: '82px'},1000);
      $("#leitmotivColor").animate({height: '96px', opacity: '0'},1000);
      $("#leitmotiv").animate({height: '96px'},1000);
    });
  });


  //**** BOTONES DE DESCARGA LEITMOTIV ****
  $("#botonesDescarga a.mp3").hover(
    //Mouse enter
    function() {
      $("#tooltipDescargas span.mp3").animate({opacity: '0.5'},300);
    },
    //Mouse leave
    function() {
      $("#tooltipDescargas span.mp3").animate({opacity: '0.1'},300);
    }
  );

  $("#botonesDescarga a.wav").hover(
    //Mouse enter
    function() {
      $("#tooltipDescargas span.wav").animate({opacity: '0.5'},300);
    },
    //Mouse leave
    function() {
      $("#tooltipDescargas span.wav").animate({opacity: '0.1'},300);
    }
  );

  $("#botonesDescarga a.flac").hover(
    //Mouse enter
    function() {
      $("#tooltipDescargas span.flac").animate({opacity: '0.5'},300);
    },
    //Mouse leave
    function() {
      $("#tooltipDescargas span.flac").animate({opacity: '0.1'},300);
    }
  );


  //**** FANCY-BOX ****
  $("#fotos a").attr('rel', 'gallery').fancybox({
    openEffect: 'elastic',
    closeEffect: 'elastic',
    padding: 8
  });


  //**** ABRE Y CIERRA VIDEO "TODOS" ****
  $("#escuchaTodos").click(function(){
    $(".boxSextoMundo").fadeOut(400,function() { 
      $(".boxTodos").animate({width: '779px'},1000);
      $("#escuchaTodos").fadeOut(1000, function() {
        $("#videoTodos").fadeIn(1000);
        $(".boxTodos .cerrarVideo").fadeIn(1000);
      });
    });
  });

  $(".boxTodos .cerrarVideo").click(function(){
    $(this).fadeOut(1000);
    playerTodos.stopVideo();
    $("#videoTodos").fadeOut(1000, function() {
      $("#escuchaTodos").fadeIn(1000);
      $(".boxTodos").animate({width: '333px'},1000, function() {
        $(".boxSextoMundo").fadeIn(400);
      });
    });
  });

  //**** ABRE Y CIERRA VIDEO "SEXTO MUNDO" ****
  $("#miraSextoMundo").click(function(){
    $(".boxTodos").fadeOut(400,function() {
      $(".boxSextoMundo").animate({width: '779px'},1000);
      $("#miraSextoMundo").fadeOut(1000, function() {
        $("#videoSextoMundo").fadeIn(1000);
        $(".boxSextoMundo .cerrarVideo").fadeIn(1000);
      });
    });
  });

  $(".boxSextoMundo .cerrarVideo").click(function(){
    $(this).fadeOut(1000);
    playerSexto.stopVideo();
    $("#videoSextoMundo").fadeOut(1000, function() {
      $("#miraSextoMundo").fadeIn(1000);
      $(".boxSextoMundo").animate({width: '333px'},1000, function() {
        $(".boxTodos").fadeIn(400);
      });
    });
  });


  //**** AVANZA COMMENTS YOUTUBE ****
  $("#cargarMas").click(function() {
    if(d+cantComments < entries.length) {
        h = h + cantComments;
        d = d + cantComments;
    }

    muestraComments(d,h);
  });


  //**** RETROCEDE COMMENTS YOUTUBE ****
  $("#cargarMenos").click(function() {
    if(d-cantComments < 0) {
      d = d;
    } else {
      h = h - cantComments;
      d = d - cantComments;
    }

    muestraComments(d,h);
  });


  //**** CREA ETIQUETA SCRIPT PARA API YOUTUBE ****
  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScript = document.getElementById('fondoVideo');
  firstScript.parentNode.insertBefore(tag, firstScript);

});


//**** CARGA COMMENTS YOUTUBE ****
function comentariosYT(data) {
  var feed = data.feed;
  entries = feed.entry || [];
  muestraComments(d,h);
}


//**** MUESTRA COMMENTS YOUTUBE ****
function muestraComments(desde,hasta) {
  var comment = '';
  var fecha_comment = '';
  var entry = '';
  var user = '';
  var html = ['<ul>'];
  if(hasta > entries.length) {
    hasta = entries.length;
  }
  for(i = desde; i < hasta; i++) {
    entry = entries[i];
    comment = entry.content.$t;
    fecha_comment = String(entry.published.$t);
    user = entry.author[0].name.$t;
    html.push('<li>');
    html.push('<span>El ', showFecha(fecha_comment), ' ', '<a href=\"http://www.youtube.com/user/', user, '\" Title=\"', 'Ir al usuario de YouTube', '\">', user, '</a> dijo:</span>');
    html.push('<p><img class=\"comilla_izq\" src=\"imagenes/comilla_izq.png\" height=\"30\" width=\"40\" />', comment, '<img class=\"comilla_der\" src=\"imagenes/comilla_der.png\" height=\"28\" width=\"34\" /></p>');
    html.push('</li>');
  }
  html.push('</ul>');
  document.getElementById('comments').innerHTML = html.join('');
}

//*** FECHA EN COMMENTS YOUTUBE ****
function showFecha(fecha) {
  var anio = fecha.substring(0,4);
  var mes = fecha.substring(5,7);
  var dia = fecha.substring(8,10);
  var f_fecha = dia + '-' + mes + '-' + anio;
  return f_fecha;
}

/*function comentariosYT(data) {
  var feed = data.feed;
  var entries = feed.entry || [];
  var comment = '';
  var fecha_comment = '';
  var entry = '';
  var user = '';
  var html = ['<ul>'];
  for(i = 0; i < entries.length; i++) {
    entry = entries[i];
    comment = entry.content.$t;
    fecha_comment = String(entry.published.$t);
    user = entry.author[0].name.$t;
    html.push('<li>');
    html.push('<span>El ', showFecha(fecha_comment), ' ', '<a href=\"http://www.youtube.com/user/', user, '\" Title=\"', 'Ir al usuario de YouTube', '\">', user, '</a> dijo:</span>');
    html.push('<p><img class=\"comilla_izq\" src=\"imagenes/comilla_izq.png\" height=\"30\" width=\"40\" />', comment, '<img class=\"comilla_der\" src=\"imagenes/comilla_der.png\" height=\"28\" width=\"34\" /></p>');
    html.push('</li>');
  }
  html.push('</ul>');
  document.getElementById('comments').innerHTML = html.join('');
*/



/*#### VIDEOS YOUTUBE (API) ####*/  

var playerTodos;
var playerSexto;

function onYouTubeIframeAPIReady() {
    playerTodos = new YT.Player('videoTodos', {
       events: {
           'onReady': onPlayerTodosReady
          }     
    });

    playerSexto = new YT.Player('videoSextoMundo', {
       events: {
           'onReady': onPlayerSextoReady
          }     
    });
}

function onPlayerTodosReady(event) {
    event.target.setPlaybackQuality('large');
}

function onPlayerSextoReady(event) {
    event.target.setPlaybackQuality('large');
}