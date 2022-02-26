import type { NextPage } from "next";
import { useState } from "react";
import CallToAction from "../components/CallToAction";
import Download from "../components/Download";
import DownloadModal from "../components/DownloadModal";
import Features from "../components/Features";
import Nav from "../components/nav";

const Home: NextPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-black text-white">
      <DownloadModal open={open} setOpen={setOpen} />
      <Nav />
      <Download open={open} setOpen={setOpen} />
      <Features />
      <CallToAction open={open} setOpen={setOpen} />
    </div>
  );
};

export default Home;
