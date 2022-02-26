import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";

const Fxty: NextPage = () => {
  // Use scrollmagic to trigger confetti
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 360,
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });
  }, []);

  return (
    <>
      <Head>
        <title>fxty();</title>
      </Head>
      <div>
        <section className="">
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="py-8 text-center text-white text-3xl px-10 m-10 font-extrabold">
              <p>
                <span className="text-transparent text-4xl bg-clip-text bg-gradient-to-tr from-[#ff009d] to-[#00aeff] hover:text-[#ffffff] transition-all">
                  fxty();
                </span>
              </p>
              <Tooltip title="not tristan at all ;)" arrow>
                <span className="text-sm text-blue-300">
                  Hey I&apos;m fxty();
                </span>
              </Tooltip>
            </div>
          </div>
        </section>
        <section className="">
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="py-8 text-center text-white text-1xl px-10 m-10 font-extrabold">
              <p>
                Why? It&apos;s mainly a{" "}
                <Tooltip title="now begone" arrow>
                  <span className="text-transparent text-1xl bg-clip-text bg-gradient-to-tr from-[#ff009d] to-[#00aeff] hover:text-[#ffffff] transition-all">
                    social experiment
                  </span>
                </Tooltip>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Fxty;
