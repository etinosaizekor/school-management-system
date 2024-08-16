import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Classes from "./pages/Classes";

function App() {
  return <Routes >
    <Route element={<Layout/>}>
    <Route path="/classes" element={<Classes/>}/>

    </Route>
  </Routes>;
}

export default App;
