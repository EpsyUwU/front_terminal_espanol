import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const TerminalComponent = () => {
    const [socket, setSocket] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [output, setOutput] = useState([]);
  
    useEffect(() => {
      const socketInstance = io('http://localhost:3000'); // Especifica la URL de tu servidor Socket.IO aquí
      setSocket(socketInstance);
  
      socketInstance.on('connect', () => {
        console.log('Conectado al servidor Socket.IO');
      });
  
      socketInstance.on('disconnect', () => {
        console.log('Desconectado del servidor Socket.IO');
      });
  
      socketInstance.on('output', (data) => {
        setOutput((prevOutput) => [...prevOutput, data]);
      });
  
      return () => {
        socketInstance.disconnect();
      };
    }, []);
  
    const sendCommand = () => {
      if (socket && inputValue.trim() !== '') {
        socket.emit('command', inputValue.trim());
        setInputValue('');
      }
    };
  
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="terminal">
            {output.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
        <div className="input-container p-4">
          <input
            type="text"
            className="w-full px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder="Escribe un comando..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="ml-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            onClick={sendCommand}
          >
            Enviar
          </button>
        </div>
      </div>
    );  
};

export default TerminalComponent;
