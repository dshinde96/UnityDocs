import { useCallback, useEffect, useState } from 'react';
import Quill from "quill";
import io from 'socket.io-client'
import '../style.css'
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];



const TextEditor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { id: documentID } = useParams();
  const [Title,setTitle]=useState('');
  const [loading,setloading]=useState(true);
  const navigate=useNavigate();
  const img_src = "https://th.bing.com/th/id/OIP.q7X7waysZCgCylvKrjggvAHaKP?w=132&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7";

  //Once the Component is rendered, set connection as socket
  useEffect(() => {
    if (!localStorage.getItem('authTocken')) {
      navigate('/login');
    }
    const s = io("http://localhost:8000/textEditor", {
      auth: {
        token: localStorage.getItem('authTocken'),
      },
      query: {
        documentID: documentID
      }
    });
    setSocket(s);
    return () => {
      s.disconnect();
    }
  }, []);

  //Once connection is set, load document from db 
  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (document) => {
      if(document=="Not found" || document=="Unauthorized Access"){
        navigate('/');
      }
      quill.setContents(document.data);
      setTitle(document.title);
      setloading(false);
      quill.enable();   //quill will be disable until the document is loaded.
    }
    socket.once('loadDocument', handler); 
    socket.emit('getDocument');
  }, [socket, quill, documentID]);

  //Handle change in data of docs
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handlerUpdateContent = (delta) => {  
      quill.updateContents(delta);
    }
    socket.on('recive-change', handlerUpdateContent);

    const handlerUpdatedocs = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta)
    }
    quill.on('text-change', handlerUpdatedocs);

    const interval = setInterval(() => {
      socket.emit('saveChanges', quill.getContents());
    }, 2000);

    return () => {
      socket.off('recive-change', handlerUpdateContent);
      quill.off('text-change', handlerUpdatedocs);
      clearInterval(interval);
    }
  }, [socket, quill]);

  //Handle change in title of docs
  useEffect(() => {
    if (socket == null) return;
    const interval = setInterval(() => {
      socket.emit('saveTitle', Title);
    }, 2000);
    const handler=(title)=>{
      setTitle(title);
    }
    socket.emit('titleChange',Title);
    socket.on('titleChange',handler);
    return () => {
      if(Title=='')
      setTitle("Untitled Document");
      socket.emit('saveTitle', Title);
      clearInterval(interval);
    }
  }, [socket, Title]);

  //Setting up quill
  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement('div');
    wrapper.append(editor);
    const q = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions
      }, theme: 'snow'
    },);
    q.disable();
    q.setText('Loading...')
    setQuill(q);
  }, []);

  return (
    <>
      <Navbar />
      <div className='title'>
        <div className='titleCnt'>
          <img src={img_src}/>
          <div className='inputCnt'>
          <input type="text" value={Title} onChange={(event)=>{setTitle(event.target.value)}} placeholder='Title' disabled={loading?"true":""} />
          </div>
        </div>
      </div>
      <div class="main_container" ref={wrapperRef}></div>
    </>
  )
}

export default TextEditor;