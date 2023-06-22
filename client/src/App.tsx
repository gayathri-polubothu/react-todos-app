import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Home} from "./pages/home";
import {Login} from "./pages/login";
import {Navbar} from "./components/navbar"
import {Register} from "./pages/register";
import {AddTodo} from "./pages/addTodo";

function App() {
  return (
      <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path={"/"} element={<Login/>} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/todos"} element={<Home fromCompletedTodos={false}/>} />
            <Route path={"/all-todos"} element={<Home allTodos/>} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/add-todo"} element={<AddTodo />} />
            <Route path={"/completed-todos"} element={<Home fromCompletedTodos={true} />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;