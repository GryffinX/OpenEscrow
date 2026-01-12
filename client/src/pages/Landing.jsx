import { useEffect, useRef } from "react";
import ConnectWallet from "../components/ConnectWallet";
import "./landing.css";

function Landing({ setProvider }) {
  const glowRef = useRef(null);

  useEffect(() => {
  const move = (e) => {
    if (!glowRef.current) return;

    glowRef.current.style.left = `${e.clientX}px`;
    glowRef.current.style.top = `${e.clientY}px`;
  };

  window.addEventListener("mousemove", move);
  return () => window.removeEventListener("mousemove", move);
}, []);


  return (
    <div className="landing-root">
      {/* Cursor glow */}
      <div ref={glowRef} className="cursor-glow" />

      {/* Background title */}
      <h1 className="landing-title">OpenEscrow</h1>

      {/* Center button */}
      <div className="landing-center">
        <ConnectWallet setProvider={setProvider} />
      </div>
    </div>
  );
}

export default Landing;
