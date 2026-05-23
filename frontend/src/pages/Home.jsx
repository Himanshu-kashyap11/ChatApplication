import React from "react";
import SideBar from "../component/SideBar.jsx";
import MessageArea from "../component/MessageArea.jsx";
import GetMessages from "../customHooks/getMessages.jsx";

const Home = () => {
  return (
    <div className="w-full h-[100vh] flex">
      <GetMessages />
      <SideBar />
      <MessageArea />
    </div>
  );
};

export default Home;