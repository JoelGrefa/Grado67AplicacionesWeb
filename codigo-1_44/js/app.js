$(document).ready(function () {
  // Mostrar el spinner de carga mientras simulamos la carga de las películas
  $("#spinner").show();
  $("#lista-peliculas").hide(); // Aseguramos que las películas estén ocultas al principio

  // Simulación de retraso de 5 segundos antes de cargar las películas
  setTimeout(function () {
    $.ajax({
      url: "data/peliculas.json",  // Asegúrate de que el archivo 'peliculas.json' esté bien enlazado
      method: "GET",
      dataType: "json",
      success: function (peliculas) {
        let html = "";
        peliculas.forEach(function (peli) {
          html += `
            <div class="col-md-4">
              <div class="card h-100 shadow">
                <img src="img/${peli.imagen}" class="card-img-top" alt="${peli.titulo}">
                <div class="card-body">
                  <h5 class="card-title">${peli.titulo}</h5>
                  <p class="card-text">${peli.generos.join(', ')}</p>
                  <!-- Botón "Ver tráiler" con el atributo data-trailer con la URL del tráiler -->
                  <button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#trailerModal" data-trailer="${toEmbed(peli.trailer)}">Ver tráiler</button>
                  <a href="pages/detalle.html?id=${peli.id}" class="btn btn-primary">Ver más</a>
                </div>
              </div>
            </div>`;
        });

        // Mostrar las películas después del retraso
        $("#lista-peliculas").html(html);
        $("#lista-peliculas").fadeIn(); // Mostrar las películas con efecto

        // Ocultar el spinner de carga
        $("#spinner").hide();
      },
      error: function (xhr, status, error) {
        console.error("Error al cargar las películas:", error);
        $("#lista-peliculas").html(`
          <div class="col-12">
            <div class="alert alert-danger text-center" role="alert">
              No se pudo cargar la lista de películas. Intenta nuevamente más tarde.
            </div>
          </div>
        `);

        // Ocultar el spinner de carga
        $("#spinner").hide();
      }
    });
  }, 5000); // Retraso de 5 segundos

  // Función para convertir cualquier enlace de YouTube a formato "embed"
  function toEmbed(u) {
    try {
      const url = new URL(u);
      const host = url.hostname;

      // youtu.be/<id>
      if (host.includes("youtu.be")) {
        const vid = url.pathname.replace("/", "");
        return `https://www.youtube.com/embed/${vid}`;
      }

      // youtube.com/watch?v=<id>
      if (host.includes("youtube.com")) {
        if (url.pathname.startsWith("/embed/")) return u;
        const v = url.searchParams.get("v");
        if (v) return `https://www.youtube.com/embed/${v}`;
      }
    } catch (e) {
      console.warn("Error al convertir URL del tráiler:", e);
    }
    return u; // fallback
  }

  // Evento para abrir el modal de tráiler
  $('#trailerModal').on('show.bs.modal', function (event) {
    // Obtener el botón que fue clickeado
    var button = $(event.relatedTarget);
    var trailerUrl = button.data('trailer'); // Traer la URL del tráiler desde el data-trailer
    var modal = $(this);
    
    // Establecer la URL del tráiler en el iframe
    modal.find('#modal-trailer').attr('src', trailerUrl);
  });

  // Cerrar el modal y detener el video al cerrarlo
  $('#trailerModal').on('hidden.bs.modal', function () {
    var modal = $(this);
    modal.find('#modal-trailer').attr('src', ''); // Detener el video cuando el modal se cierra
  });
});
