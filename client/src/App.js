import TextEditor from './Components/TextEditor';
import {Routes,Route, useNavigate} from 'react-router-dom';
import Login from "./UserAuth/Login";
import Home from './Components/Home';
import Signup from './UserAuth/Signup';
import AllowedStudents from './Components/AllowedUsers';
function App() {
  return (
      <Routes>
      <Route exact path='/' element={<Home/>}/>
        <Route exact path='/documet/:id' element={<TextEditor/>}/>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/register' element={<Signup/>}/>
        <Route exact path='/getAllowedUsers/:id' element={<AllowedStudents/>}/>
      </Routes>
  );
}

export default App;
