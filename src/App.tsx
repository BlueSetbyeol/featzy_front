import { Outlet } from "react-router";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <main className="w-screen h-[92vh] flex flex-col justify-center items-center overflow-y-auto">
        <Outlet />
      </main>
      <Navbar />
    </>
  );
}
