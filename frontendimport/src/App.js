import React, { useState } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import CSVReader from 'react-csv-reader';
import './App.css';
const API_URL = "http://localhost:5000/api"
function App() {
  const [datosCSV, setDatosCSV] = useState([]);
  function manejarCambioArchivo(evento) {
    const archivoSeleccionado = evento.target.files[0];
    if (archivoSeleccionado) {
      leerCSV(archivoSeleccionado);
    }
  }

  function leerCSV(archivoCSV) {
    const lector = new FileReader();

    lector.onload = function (evento) {
      const contenido = evento.target.result;
      const lineas = contenido.split('\n');
      // Obtener encabezados
      const encabezados = lineas[0].split(',').map(header => header.trim().replace(/\r$/, ''));

      //console.log("encabezados: ", encabezados);
      const datos = [];
      for (let i = 1; i < lineas.length; i++) {
        const linea = lineas[i].split(',').map(header => header.trim().replace(/\r$/, ''));
        const registro = {};
        let cont = 0;
        // Asignar valores a las claves del objeto usando los encabezados como referencia
        for (let j = 0; j < encabezados.length; j++) {
          if (linea[cont] !== undefined && linea[cont].includes('"')) {
            let arrayaux = [];
            arrayaux.push(linea[cont]);
            cont++;
            for (let k = cont; k < linea.length; k++) {
              if (linea[cont] !== undefined && linea[cont].includes('"')) {
                arrayaux.push(linea[cont]);
                let concat = "";
                for (let l of arrayaux) {
                  concat = concat + "," + l;
                }
                registro[encabezados[j]] = concat;
                cont++;
                break;
              } else {
                arrayaux.push(linea[cont]);
                cont++;
              }
            }
          } else {
            registro[encabezados[j]] = linea[cont];
            cont++;
          }
        }

        // Agregar el registro al array de datos
        datos.push(registro);
      }

      //console.log("Datos en formato JSON:", datos);
      setDatosCSV(datos); // Asumiendo que setDatosCSV es una función que usas para establecer los datos en algún lugar
      //console.log("final:;", datos);
    };

    lector.readAsText(archivoCSV);
  }

  const importData = async (data) => {
    try {
      //console.log(data);
      //console.log(csvData);
      if (csvData) {
        const response = await axios.post(`${API_URL}/import`, csvData);
        //console.log("todo salio bien", response);
      }
      else {
        //console.log("datosCSV vacio")
      }
    } catch (error) {

    }
  };
  const [csvData, setCsvData] = useState(null);

  function handleFile(data) {
    // Extract headers (first row)
    const headers = data[0];
  
    // Remove headers from data
    const rows = data.slice(1);
  
    // Construct objects with headers as keys
    const formattedData = rows.reduce((acc, row) => {
      // Check if row has the same number of columns as headers
      if (row.length === headers.length) {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        acc.push(obj);
      } else {
        console.warn(`Ignoring row: ${row} - mismatch with headers`);
      }
      return acc;
    }, []);
  
    // Set formatted data to state
    setCsvData(formattedData);
    //console.log(formattedData);
  }
  

  return (
    <div>
      <h2>Nueva version</h2>
      <CSVReader
        onFileLoaded={handleFile}
        inputId="csv-input"
        inputStyle={{color: 'red'}}
      />
      <h2>Seleccionar archivo CSV:</h2>
      <input type="file" accept=".csv" onChange={manejarCambioArchivo} />
      <h2>Datos del archivo CSV:</h2>
      {/*<ul>
  {datosCSV.map((fila, indiceFila) => (
    <li key={indiceFila}>{JSON.stringify(fila)}</li>
  ))}
</ul>*/}
      <input type='submit' onClick={() => importData(datosCSV)} />
    </div>
  );
}

export default App;
