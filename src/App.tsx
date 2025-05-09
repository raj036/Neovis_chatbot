import React from "react";
// import { useState } from 'react'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import AllMessage from "./Components/AllMessage";
import AIMessage from "./Components/AIMessage";
import Assigned from "./Components/Assigned";
import Unassigned from "./Components/Unassigned";
import Important from "./Components/Important";
import Closed from "./Components/Closed";
import UserChatWindow from "./Components/UserChatWindow";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AllMessage />} />

          <Route path="/all-messages" element={<AllMessage />} />
          <Route path="/ai-messages" element={<AIMessage />} />
          <Route path="/assigned" element={<Assigned />} />
          <Route path="/unassigned" element={<Unassigned />} />
          <Route path="/important" element={<Important />} />
          <Route path="/closed" element={<Closed />} />
          <Route path="/userchat" element={<UserChatWindow />} />
          <Route path="/userchat" element={<UserChatWindow />} />
          <Route path="/assigned" element={<Assigned />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
