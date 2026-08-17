// import { useState, useEffect } from "react";
// import Header from "./components/Header";
// import ListaTarefas from "./components/ListaTarefas";
// import Contador from ".components/Contador";

// function tarefaV1() {
//   const [tarefas, setTarefas] = useState([]);
//   const [proximoId, setProximoId] = useState(1);
//   const [texto, setTexto] = useState("");
//   const [prioridade, setPrioridade] = useState("media");
//   useEffect(() => {
//     const salvo = localStorage.getItem('taskflow-tarefas');
//     if (salvo) {
//       const dados = JSON.parse(salvo);
//       setTarefas(dados);
//       if (dados.length > 0) {
//         setProximoId(dados[dados.length - 1].id + 1);
//       }
//     }
//   }, []); 
//   // Estado para controlar o filtro ativo ("todas" | "pendentes" | "concluidas")
//   const [filtroStatus, setFiltroStatus] = useState("to~~kdas");

//   function adicionarTarefa() {
//     if (texto.trim() === "") return;

//     setTarefas((tarefasAntigas) => [
//       ...tarefasAntigas,
//       {
//         id: proximoId,
//         texto: texto.trim(),
//         concluida: false,
//         prioridade: prioridade,
//       },
//     ]);

//     setProximoId((prevId) => prevId + 1);
//     setTexto("");
//     setPrioridade("media");
//   }

//   function deletarTarefa(id) {
//     setTarefas((prev) => prev.filter((t) => t.id !== id));
//   }

//   function concluirTarefa(id) {
//     setTarefas((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t))
//     );
//   }

//   // Contadores para as métricas
//   const totalTarefas = tarefas.length;
//   const concluidas = tarefas.filter((t) => t.concluida).length;
//   const pendentes = totalTarefas - concluidas;

//   // Filtragem das tarefas
//   const tarefasFiltradas = tarefas.filter((t) => {
//     if (filtroStatus === "pendentes") return !t.concluida;
//     if (filtroStatus === "concluidas") return t.concluida;
//     return true; // "todas"
//   });

//   return (
//     <div id="app">
//       <Header 
//         titulo="TaskFlow" 
//         subtitulo="Gerencie suas tarefas" 
//         total={totalTarefas}
//         pendentes={pendentes}
//         concluidas={concluidas}
//         filtroAtual={filtroStatus}
//         onMudarFiltro={setFiltroStatus}
//       />
      
//       <main className="container">
//         <section id="formulario">
//           <div className="campo-linha">
//             <input
//               type="text"
//               value={texto}
//               onChange={(e) => setTexto(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && adicionarTarefa()}
//               placeholder="Nova tarefa..."
//             />

//             <select
//               value={prioridade}
//               onChange={(e) => setPrioridade(e.target.value)}
//             >
//               <option value="baixa">Baixa</option>
//               <option value="media">Média</option>
//               <option value="alta">Alta</option>
//             </select>

//             <button onClick={adicionarTarefa}>Adicionar</button>
//           </div>
//         </section>
//         {/* Lista de Tarefas Filtradas */}
//         <ListaTarefas
//           tarefas={tarefasFiltradas}
//           onDeletar={deletarTarefa}
//           onConcluir={concluirTarefa}
//         />
//       </main>

//       <footer>
//         <p>TaskFlow 2026 - Victor</p>
//       </footer>
//     </div>
//   );
// }

// export default App;