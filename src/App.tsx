/* eslint-disable @typescript-eslint/ban-ts-comment */
import './App.css'
import ManoParaAbajo from "./svg/manoParaAbajo.svg"
import Plus from "./svg/plus.svg"
import Info from "./svg/info.svg"
import Settings from "./svg/settings.svg"
import FlechaParaAbajo from "./svg/flechaAbajo.svg"
import Delete from "./svg/delete.svg"
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [vista, setVista] = useState<boolean>(true);
  const [setting, setSetting] = useState<boolean>(false);
  const [formulario, setFormulario] = useState<boolean>(false);
  const [alfabetico, setAlfabetico] = useState<string>("AZ");
  const [lista, setLista] = useState<string[]>([]);
  const [listaRender, setListaRender] = useState<string[]>([]);
  const [nombreReten, setNombreReten] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [newText, setNewText] = useState<string>("");

  useEffect(() => {
    if(lista.length === 0) BuscarInfo();
    RenderDeLista();
  }, [lista])

  const RenderDeLista = () => {
    if (alfabetico === "AZ") OrdenAZ();
    else if (alfabetico === "ZA") OrdenZA();
  }

  const BuscarInfo = () => {
    if (lista.length > 0) return;
    const aux = localStorage.getItem("Lista");
    if (!aux) return;
    const data = JSON.parse(aux).map((n: string) => removerCaracteresEspeciales(n));
    if (data && data.length > 0 && typeof data[0] === "string") setLista(data);
  }

  const OrdenAZ = () => {
    if (lista.length > 0) setListaRender(lista.sort((a, b) => a.localeCompare(b)));
    else setListaRender([]);
  }

  const OrdenZA = () => {
    if (lista.length > 0) setListaRender(lista.sort((a, b) => a.localeCompare(b)).reverse());
    else setListaRender([]);
  }

  function removerCaracteresEspeciales(string: string) {
    const caracteresEspeciales = /[^a-zA-Z0-9\s]/g;
    const stringSinAcentos = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return stringSinAcentos.replace(caracteresEspeciales, "");
  }

  const Busqueda = (text: string) => {
    setBusqueda(text)
    setListaRender(lista.filter((n) =>
      n.toLowerCase().includes(text.toLowerCase())));
  }

  const MostrarAgregar = () => {
    setFormulario(true);
    setSetting(false)
  }

  const AgregarFile = () => {
    if (nombreReten.length === 0) return;
    const nuevaLista = [...nombreReten.map(n => removerCaracteresEspeciales(n)), ...lista];
    localStorage.setItem('Lista', JSON.stringify(nuevaLista));
    setLista(nuevaLista);
    setNombreReten([]);
    cartelSuccessFast("Agregados con exito!");
  }

  const RetenerNombres = (e: any) => {
    if (!e) return;
    cartelDeCarga();
    const archivo = e.target.files[0];
    const lector = new FileReader();

    lector.onload = function (evento: any) {
      const contenido = evento?.target?.result;
      if (typeof contenido === "string") {
        const nombres: string[] = contenido.split('\n')?.map(nombre => nombre.trim()).filter(n => n !== "");
        if (nombres && nombres.length > 0 && typeof nombres[0] === "string") setNombreReten(nombres);
      }
    };

    lector.readAsText(archivo);
  }

  const AgregarManul = () => {
    const nuevaLista: string[] = [...lista]
    nuevaLista.push(removerCaracteresEspeciales(newText))
    localStorage.setItem('Lista', JSON.stringify(nuevaLista));
    setLista(nuevaLista);
    setNewText("");
    cartelSuccessFast("Agregado con exito!");
  }

  const RemoveAll = () => {
    localStorage.setItem('Lista', JSON.stringify([]));
    setLista([]);
    cartelSuccessFast("Limpiado con exito!")
  }

  const Remove = (text: string) => {
    const data = [...lista];
    const nuevaLista: string[] = data.filter(n => n.toLowerCase() !== text.toLowerCase());
    localStorage.setItem('Lista', JSON.stringify(nuevaLista));
    setLista(nuevaLista);
    cartelSuccessFast("Removido con exito!");
  }

  const cartelDeCarga = () => {
    const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 3000));
    toast.promise(
      resolveAfter3Sec,
      {
        pending: 'Cargando los datos',
        success: 'Listo para agregar!',
        error: 'Promise rejected'
      }
    )
  }

  const cartelSuccessFast = (text: string) => {
    toast.success(text, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  return (
    <div className={`
      h-screen w-full
      ${vista ? "bg-gradient-to-t from-teal-900 via-emerald-600 via-30% from-9%" : "bg-zinc-200"}
      `}>
      <aside className={`${formulario ? "flex" : "hidden"} absolute z-50 top-0 left-0 p-0 m-0 h-screen w-screen bg-[rgb(0,0,0,0.5)] flex justify-center items-center`}>
        <span className='absolute top-0 right-0 p-3'>
          <button className='p-4 bg-red-600 opacity-100 z-100 rounded-full' onClick={e => { e.preventDefault(); setFormulario(false) }}>
            <Delete />
          </button>
        </span>
        <form className='h-[400px] md:h-[50vh] w-full md:w-[70%] gap-10 md:rounded-md bg-zinc-200 flex flex-col md:flex-row items-center justify-center' onSubmit={e => e.preventDefault()}>
          <div className='w-full h-[40%] p-5 md:h-full md:w-[50%] flex flex-col justify-center md:justify-around items-center gap-5'>
            <h4 className='text-2xl text-center'>Manual</h4>
            <div className='flex flex-col w-[80%] p-2 gap-5 items-center'>
              <input type="text" value={newText} placeholder='Texto para Agrear' className='w-[80%] p-2 text-xl rounded-md focus:border-0' onChange={e => setNewText(e.target.value)} />
              <button className='bg-green-600 w-[80%] py-2 rounded-lg border border-black' onClick={e => { e.preventDefault(); AgregarManul() }}>Agregar</button>
            </div>
          </div>
          <div className='w-full h-[40%] p-5 md:h-full md:w-[50%] flex flex-col justify-center md:justify-around items-center gap-5'>
            <h4 className='text-2xl text-center'>Archivo</h4>
            <div className='flex flex-col w-[80%] p-2 gap-5 items-center'>
              <div className='flex max-w-[100%] w-[80%] gap-1 items-center justify-between'>
                <label htmlFor="file" className='w-[80%] bg-slate-100 p-2 text-xl rounded-md hover:cursor-pointer hover:opacity-70'>
                  Selcciona Archivo
                </label>
                {/* @ts-ignore */}
                <Info className="h-[20px] w-[15%] hover:cursor-pointer" onClick={e => { e.preventDefault(); }} />
              </div>
              <input type="file" accept=".txt" id="file" className='hidden' onChange={e => RetenerNombres(e)} />
              <button className='bg-green-600 w-[80%] py-2 rounded-lg border border-black' onClick={e => { e.preventDefault(); AgregarFile(); }}>Agregar</button>
            </div>
          </div>
        </form>
      </aside>
      <span className={`hidden ${vista ? "" : "md:flex"} absolute top-0 right-0 pt-7 pe-4`}>
        <button className="h-[30px] hover:opacity-70" onClick={e => { e.preventDefault(); setSetting(!setting) }}>
          {/* @ts-ignore */}
          <Settings className="h-full" />
        </button>
      </span>
      <header
        className={`${vista ? "h-[80vh]" : "h-[15vh]"}
          transition-all duration-500 ease-in-out
          w-full 
          flex flex-col justify-center items-center`}
      >
        <h1 className={`${vista ? "text-[50px] md:text-[100px]" : "text-[35px] md:text-[50px]"} duration-700 text-center font-extrabold px-5`}>Encuentra Rápido</h1>
        <p className={`${vista ? "opacity-0 md:opacity-100" : "-z-1 top-[-100vh] absolute opacity-0"} max-w-[70vw] pt-10 text-center text-clip text-[20px]`}>Descubre una búsqueda increíblemente fácil y eficiente. Tú proporcionas las palabras y nosotros nos encargamos del resto. Nuestra búsqueda dinámica organiza y ordena las listas por ti, creando una experiencia fluida y sin complicaciones.</p>
      </header>
      <main className={`${vista ? "h-[20vh] items-center" : "h-[8vh] p-0 md:p-5 md:h-[15vh]"} w-full
          transition-all duration-500 ease-in-out
          flex flex-col items-center
          `}>
        <div className={`${vista ? "opacity-100" : "top-[-100vh] absolute opacity-0"} text-xl md:text-base min-w-[80%] md:min-w-[600px] pt-2 pb-1 flex gap-1 items-center`}>
          <label className="font-bold">Click aqui para comenzar!</label>
          <ManoParaAbajo />
        </div>
        <form className='min-w-[80%] md:min-w-[600px] h-auto flex justify-around' onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            value={busqueda}
            placeholder='Rápidooooooooooooo'
            className='min-w-[100%] h-[50px] text-2xl md:text-xl p-2 rounded-md border border-black'
            onFocus={e => { e.preventDefault(); vista ? setVista(false) : "" }}
            onChange={e => Busqueda(e.target.value)}
          />
        </form>
      </main>
      <aside className={`${vista ? "hidden" : "flex"} 
          flex-col items-center gap-5
          transition-all duration-100 ease-in-out
          ${!setting ? "md:translate-x-[-100%]" : "md:translate-x-[0%] mb-10 md:mb-0"}
          md:bg-gradient-to-t  from-teal-900 via-emerald-600 to-white
          md:absolute md:top-0 md:w-[25vw] md:h-screen 
        `}>
        <div
          className='w-[50%] p-3 py-5 flex justify-center items-center gap-5 hover:opacity-70 hover:cursor-pointer'
          onClick={e => { e.preventDefault(); setSetting(!setting) }}
        >
          <h3 className='text-2xl'>Configuraciones</h3>
          <button type='button' className={`${setting ? "rotate-180" : ""} md:hidden duration-100`}>
            <FlechaParaAbajo />
          </button>
        </div>
        <form className={`${!setting ? "h-0 absolute top-[-100vh] opacity-0" : "h-auto opacity-100"} py-4 w-[90%] flex flex-col items-center border border-dashed border-black`} onSubmit={e => e.preventDefault()}>
          <h4 className='text-xl'>Funciones de Lista</h4>
          <div className='py-2 w-full flex justify-center items-center'>
            <button type="button" className='hover:opacity-70 flex justify-center items-center gap-2 p-2 bg-transparent border border-black rounded-lg w-[70%]' onClick={e => { e.preventDefault(); MostrarAgregar() }}>Agregar <Plus /></button>
          </div>
        </form>
        <form className={`${!setting ? "h-0 absolute top-[-100vh] opacity-0" : "h-auto opacity-100"} py-4 w-[90%] flex flex-col items-center border border-dashed border-black`} onSubmit={e => e.preventDefault()}>
          <h4 className='text-xl'>Orden de Lista</h4>
          <h5 className='text-xl'>Alfabetico</h5>
          <div className='py-2 w-full flex justify-center items-center'>
            <label htmlFor="AZ" className={`${alfabetico === "AZ" ? "bg-white" : ""} hover:cursor-pointer hover:opacity-70 flex justify-center items-center gap-2 p-2 bg-transparent border border-black rounded-lg w-[70%]`}>A-Z</label>
            <input type="radio" id="AZ" name="abecedario" className='hidden' checked={alfabetico === 'AZ'}
              onChange={e => { setAlfabetico(e.target.id); OrdenAZ() }}
            />
          </div>
          <div className='py-2 w-full flex justify-center items-center'>
            <label htmlFor="ZA" className={`${alfabetico === "ZA" ? "bg-white" : ""} hover:cursor-pointer hover:opacity-70 flex justify-center items-center gap-2 p-2 bg-transparent border border-black rounded-lg w-[70%]`}>Z-A</label>
            <input type="radio" id="ZA" name="abecedario" className='hidden' checked={alfabetico === 'ZA'}
              onChange={e => { setAlfabetico(e.target.id); OrdenZA() }} />
          </div>
        </form>
        <form className={`${!setting ? "h-0 absolute top-[-100vh] opacity-0" : "h-auto opacity-100"} py-4 w-[90%] flex flex-col items-center border border-dashed border-black`} onSubmit={e => e.preventDefault()}>
          <button className='w-[90%] bg-red-600 text-xl p-2 rounded-md hover:opacity-70' onClick={e => { e.preventDefault(); RemoveAll(); }}>
            Eliminar Todo
          </button>
        </form>
      </aside>
      <section className={`${vista ? "hidden" : "flex"} flex-col justify-center items-center w-full max-h-[70vh]`}>
        <ul className='bg-gradient-to-t bg-zinc-200 via-stone-200 from-black w-full min-h-[70vh] flex flex-col items-center gap-3 px-5 pb-5 overflow-x-hidden overflow-y-scroll'>
          {listaRender && listaRender.map((n, i) =>

            <li key={i} className='p-3 bg-emerald-400 min-w-full max-w-full border border-black rounded-sm flex justify-between'>
              <p className='text-black text-xl truncate w-full'>{n}</p>
              <button className='h-[30px] mx-1 hover:fill-red-700' onClick={e => { e.preventDefault(); Remove(n) }}>
                {/* @ts-ignore */}
                <Delete className="h-full fill-inherit" />
              </button>
            </li>

          )}
        </ul>
      </section>
      <ToastContainer />
    </div>
  )
}

export default App
