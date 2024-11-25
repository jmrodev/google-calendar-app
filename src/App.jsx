import React, { useState } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import './App.css';

// Configuración de credenciales
const config = {
  clientId: "780740547474-k220451m1jvnrp43jkd1v6tm4shfnn7q.apps.googleusercontent.com",
  apiKey: "AIzaSyCSECy16GA7fHV97TLi2bMR8SOy2CO2eiY",
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

const apiCalendar = new ApiCalendar(config);

const App = () => {
  const [events, setEvents] = useState([]);
  const [newEventSummary, setNewEventSummary] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [calendarReloadKey, setCalendarReloadKey] = useState(0); // Estado para forzar la recarga del iframe

  // ID del calendario embebido
  const calendarId = "juanmarcelo.rodrigueztandil@gmail.com"; // Cambia esto por tu Calendar ID

  // Iniciar sesión
  const handleLogin = () => {
    apiCalendar.handleAuthClick().then(() => {
      console.log("Usuario autenticado");
      listEvents(); // Listar eventos después de autenticarse
    }).catch(error => {
      console.error("Error en autenticación:", error);
    });
  };

  // Cerrar sesión
  const handleLogout = () => {
    apiCalendar.handleSignoutClick();
    console.log("Usuario desconectado");
  };

  // Listar eventos
  const listEvents = () => {
    apiCalendar.listUpcomingEvents(10).then(({ result }) => {
      setEvents(result.items);
    }).catch(error => {
      console.error("Error al obtener eventos:", error);
    });
  };

  // Crear evento
  const createEvent = () => {
    const event = {
      summary: newEventSummary || "Evento de Prueba",
      start: {
        dateTime: new Date(startDateTime).toISOString(),
        timeZone: "America/Argentina/Buenos_Aires",
      },
      end: {
        dateTime: new Date(endDateTime).toISOString(),
        timeZone: "America/Argentina/Buenos_Aires",
      },
    };

    apiCalendar.createEvent(event).then((result) => {
      console.log("Evento creado:", result);
      listEvents();  // Actualizar la lista de eventos después de crear uno nuevo
      setCalendarReloadKey(prevKey => prevKey + 1); // Forzar recarga del iframe
    }).catch(error => {
      console.error("Error al crear evento:", error);
    });
  };

  // Eliminar evento
  const deleteEvent = (eventId) => {
    apiCalendar.deleteEvent(eventId).then(() => {
      console.log("Evento eliminado");
      listEvents();  // Actualizar la lista de eventos después de eliminar uno
      setCalendarReloadKey(prevKey => prevKey + 1); // Forzar recarga del iframe
    }).catch(error => {
      console.error("Error al eliminar evento:", error);
    });
  };

  return (
    <div className="container">
      <h1>Mi Calendario Interactivo de Google</h1>

      {/* Botones de inicio y cierre de sesión */}
      <button onClick={handleLogin}>Iniciar Sesión</button>
      <button onClick={handleLogout}>Cerrar Sesión</button>

      {/* Campo para el nombre del evento */}
      <input
        type="text"
        placeholder="Nombre del nuevo evento"
        value={newEventSummary}
        onChange={(e) => setNewEventSummary(e.target.value)}
      />

      {/* Selección de fecha y hora de inicio */}
      <label>
        Fecha y hora de inicio:
        <input
          type="datetime-local"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
        />
      </label>

      {/* Selección de fecha y hora de finalización */}
      <label>
        Fecha y hora de finalización:
        <input
          type="datetime-local"
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
        />
      </label>

      {/* Botón para crear evento */}
      <button onClick={createEvent}>Crear Evento</button>

      {/* Botón para listar eventos */}
      <button onClick={listEvents}>Listar Próximos Eventos</button>

      {/* Lista de eventos con opción para eliminar */}
      <h2>Próximos Eventos</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <strong>{event.summary}</strong> - {new Date(event.start.dateTime).toLocaleString()}
            <button onClick={() => deleteEvent(event.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {/* Iframe para mostrar el calendario de Google embebido */}
      <h2>Vista de Calendario</h2>
      <iframe
        key={calendarReloadKey} // Usar el estado para forzar la recarga
        src={`https://calendar.google.com/calendar/embed?src=${calendarId}&ctz=America/Argentina/Buenos_Aires`}
        style={{ border: 0, width: "500px", height: "300px" }}
        title="Calendario de Google"
      ></iframe>
    </div>
  );
};

export default App;
