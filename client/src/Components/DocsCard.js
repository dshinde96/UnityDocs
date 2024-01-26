import { Link, useNavigate } from "react-router-dom";

const DocsCard = (props) => {
    const navigate = useNavigate();
    const { docs } = props;
    const img_src = "https://th.bing.com/th/id/OIP.q7X7waysZCgCylvKrjggvAHaKP?w=132&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7";
    return (
        <>
            <div className="mx-5 mt-5" style={{display:"flex", flexDirection:"column"}}>
                <div class="card" onClick={() => navigate(`/documet/${docs._id}`)}>
                    <img src={img_src} class="card-img-top" alt="..." />
                    <div class="card-body">
                        <h5 class="card-title">{docs.title}</h5>
                        {docs.owner.email !== localStorage.getItem('email') ?<div class="card-text">
                            <p style={{ fontWeight: "bold", marginBottom:"0px" }}>Owner Information</p>
                            <p>{docs.owner.name}<br />{docs.owner.email}</p>
                        </div>  : <p style={{ fontWeight: "bold", marginBottom:"0px" }}>Owner: Self</p>}
                    </div>
                </div>
                {docs.owner.email === localStorage.getItem('email') ? <Link to={`/getAllowedUsers/${docs._id}`} class="btn btn-primary">Accessible Users</Link> : ""}
            </div>
        </>
    )

}

export default DocsCard;