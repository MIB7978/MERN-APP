// import { Button } from '@chakra-ui/react'
import { Route,Switch,BrowserRouter, withRouter } from 'react-router-dom';
import './App.css';
import Chatpage from './pages/Chatpage';
import Homepage from './pages/Homepage';
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
          <div className='App'>
            <ChakraProvider>
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} exact/>
       </ChakraProvider>
    </div>
  );
}

export default App;
