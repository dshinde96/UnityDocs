import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";


const AllowedStudents = () => {
    const navigate = useNavigate();
    const [AllowedUser, setAllowedUser] = useState([]);
    const [email, setemail] = useState("");
    const [msg, setmsg] = useState("");
    const [success,setSuccess]=useState(false);
    const [loading, setloading] = useState(true);
    const { id } = useParams();

    //Fetch users who have the access of this document
    const fetchUser = async () => {
        setmsg('');
        const url = `http://localhost:8000/docs/getAllowedUsers/${id}`;
        const response = await fetch(url, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "authTocken": sessionStorage.getItem('authTocken')
            },
            body: JSON.stringify(),
        });
        const data = await response.json();
        if (response.status != 200) {
            navigate('/');
        }
        setAllowedUser(data.userAllowed);
        setloading(false);
    }

    //Give an user the access of this document
    const addUser = async () => {
        setmsg('');
        const url = `http://localhost:8000/docs/addAllowedUser/${id}`
        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "authTocken": sessionStorage.getItem('authTocken')
            },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.status != 200) {
            setSuccess(false);
            setmsg(data.msg);
        }
        else{
        setSuccess(true);
        setmsg(data.msg);
        setAllowedUser(data.userAllowed);
        setloading(false);
        }
        setTimeout(() => { setmsg('') }, 5000);
        return;
    }

    //Remove access of this document from selected user
    const removeUser = async (useremail) => {
        setmsg('');
        const url = `http://localhost:8000/docs/deleteAllowedUser/${id}`
        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "authTocken": sessionStorage.getItem('authTocken')
            },
            body: JSON.stringify({ email: useremail }),
        });
        const data = await response.json();
        if (response.status != 200) {
            setSuccess(false);
            setmsg(data.msg);
            
        }
        else{
            setAllowedUser(data.userAllowed);
            setloading(false);
            setSuccess(true);
            setmsg(data.msg);
        }
        setTimeout(() => { setmsg('') }, 5000);
        return;
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="Addusere">
                    <p style={{ color: "red", marginTop: "10px" }}>Note: These User can access ,modify and Update this document *Permanantly</p>
                    <input type="text" className="mx-2" placeholder="Enter Email of the user" onChange={(e) => setemail(e.target.value)} />
                    <button className="btn btn-primary mx-2" onClick={addUser}>Give Acccess</button>
                    <p style={{ minHeight: "25px", color: `${success?"green":"red"}`, marginTop: "10px" }}>{msg}</p>
                </div>
                <div className="AlloweUser">
                    {!loading ? AllowedUser.map((user) => <>
                        <div className="AllowedUserEle">
                            <div>Name: {user.name}</div>
                            <div>Email: {user.email}</div>
                            <button className="btn btn-danger mt-2" onClick={() => removeUser(user.email)}>Remove User</button>
                        </div>
                    </>) : ""}
                </div>
            </div>
        </>
    )
}

export default AllowedStudents;