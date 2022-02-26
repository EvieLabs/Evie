import React, { useState } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import { CakeIcon, ExclamationIcon } from "@heroicons/react/outline";

function OnTheListSubscribe(props: { refCode?: string }) {
  const [email, setEmail] = useState("");
  const [question1, setQuestion1] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [status, setStatus] = useState(<>Apply for Private Beta</>);
  const [response, setResponse] = useState<Response>();

  type Response = {
    refCode?: string;
    position?: number;
    error: boolean;
  };

  function onSubmitSubscribe(e: { preventDefault: () => void }) {
    setStatus(
      <span>
        Submitting...
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>
      </span>
    );
    e.preventDefault();
    axios
      .get("/api/applyForEvieClient", {
        params: {
          email: email,
          question1: question1,
          ref: props.refCode,
        },
      })
      .then((result) => {
        const data = result.data;
        console.log(data);
        setResponse(data);
        setSubscribed(true);
        confetti({
          particleCount: 100,
          spread: 360,
          origin: {
            x: 0.5,
            y: 0.5,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        setStatus(<>Something went wrong.</>);
      });
  }

  return !subscribed ? (
    <form onSubmit={onSubmitSubscribe}>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <div className="relative px-7 py-4 bg-[#23272A] rounded-lg divide-gray-600">
          <div className="flex flex-col items-center justify-between">
            <input
              className="bg-[#4E5D94] text-white p-2 rounded-lg text-center w-96"
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <br />
            <input
              className="bg-[#4E5D94] text-white p-2 rounded-lg text-center w-96"
              type="question1"
              name="question1"
              placeholder="Why do you want access to Evie Client?"
              onChange={(e) => setQuestion1(e.target.value)}
              value={question1}
            />
            <br />
            <button
              className="rounded px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-[#7289DA] border-[#4E5D94] items-center text-white hover:bg-[#4E5D94]"
              type="submit"
            >
              {status}
            </button>
          </div>
        </div>
      </div>
    </form>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <span className="text-2xl text-center">
        🎉 Applied! 🤞 Hopefully you&apos;ll be accepted soon!
      </span>
      <br />
      <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <CakeIcon className="h-6 w-6 text-[#7289DA]" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your {response?.position?.toLocaleString()} in-line!
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Want to get a better chance of getting in? Share your refferal
                  link for a better chance to get Evie Client early.
                </p>
                <div className="mt-2">
                  <input
                    className="bg-[#4E5D94] text-white p-2 rounded-lg text-center w-96"
                    type="text"
                    name="refCode"
                    placeholder="Your refferal code"
                    value={`https://evie.pw?ref=${
                      response?.refCode?.split("/")[4]
                    }`}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnTheListSubscribe;
