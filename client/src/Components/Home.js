import { NavLink, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from './Navbar';
import DocsCard from './DocsCard';
const { useEffect, useState } = require("react");


const Home = () => {
    const navigate = useNavigate();
    const [docList, setdocList] = useState([]);
    const [socket, setSocket] = useState();
    const img_src = "https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png";

    //Once the Component is rendered, set connection as socket
    useEffect(() => {
        if (!localStorage.getItem('authTocken')) {
            navigate('/login');
        }
        const s = io.connect("http://localhost:8000/Home", {
            reconnectionDelayMax: 10000,
            auth: {
                token: localStorage.getItem('authTocken'),
            },
            query: {
                "my-key": "my-value"
            }
        });
        setSocket(s);
        s.emit('getDocs');
        return () => {
            s.disconnect();
        }
    }, []);

    //Once the connection is set to socket, load all docslist from backend
    useEffect(() => {
        if (socket == null) return;
        const handler = (docs) => {
            console.log(docs);
            setdocList(docs);
        }
        socket.on('getDocs', handler);

        return () => {
            socket.off('getDocs', handler)
        }
    }, [socket]);

    const AddNewDocs = () => {
        socket.emit('AddNewDocs');
        socket.on('response', (documentID) => {
            navigate(`/documet/${documentID}`);
        })
    }

    return (
        <>
            <Navbar />
            <div className='container'>
                <div className='Homecnt'>
                    <div className="card  mx-5 mt-5" /*style={{ border: "0.05px solid rgb(107, 102, 102, 0.729)"}}*/ onClick={AddNewDocs}>
                        <img src={img_src} style={{ height: "15rem" , borderRadius:"0%" }} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Blank Document</h5>
                            {/* <p>Create new Document</p> */}
                        </div>
                    </div>
                    {docList.map((docs) => {
                        return (
                            <DocsCard docs={docs} />
                        )
                    })}
                </div>
            </div>

        </>
    )
}

export default Home;