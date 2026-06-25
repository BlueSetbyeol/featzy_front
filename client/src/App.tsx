import { Outlet } from "react-router";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <main className="w-screen h-[92dvh] flex flex-col justify-center items-center overflow-y-auto no-scrollbar">
        <Outlet />
      </main>
      <Navbar />
    </>
  );
}
