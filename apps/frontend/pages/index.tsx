import type { NextPage } from "next";
import Image from "next/image";
const invite =
  "https://discord.com/oauth2/authorize?client_id=807543126424158238&permissions=518855707712&scope=bot%20applications.commands";

const Home: NextPage = () => {
  return (
    <div>
      <div>
        <div className="grid justify-items-stretch ...">
          <div className="justify-self-center ...">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl leading-none font-extrabold tracking-tight mt-10 mb-8 sm:mt-14 sm:mb-10 text-white text-center">
              It&apos;s time to use Evie in your Discord server.
            </h1>
            <div className="justify-self-center ...">
              <p className="text-white text-lg sm:text-2xl sm:leading-10 font-medium mb-10 sm:mb-11 text-center">
                Evie is a feature-rich, easy to use Discord bot built to deliver
                the best experience of a bot on Discord!
              </p>
              <div className="grid justify-items-stretch ...">
                <div className="justify-self-center ...">
                  <div className="transition duration-500 ease-in-out hover: transform hover:-translate-y-1 hover:scale-550...">
                    <div className="hover: transition duration-500 hover:scale-125">
                      <a
                        href={invite}
                        id="GFG"
                        className="box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-blurple rounded-md cursor-pointer group ring-offset-2 ring-1 ring-indigo-300 ring-offset-indigo-200 hover:ring-offset-indigo-500 ease focus:outline-none"
                      >
                        Invite Evie
                        <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0">
                          <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0">
                            <span className="relative z-20 flex items-center text-sm">
                              <svg
                                className="relative w-5 h-5 mr-2 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Invite Evie
                            </span>
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
      <br />
      <br />
      <div className="text-5xl leading-none font-extrabold tracking-tight mb-4 text-white text-center">
        What is Evie all about?
      </div>
      <section className="px-2 py-32 md:px-0">
        <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
          <div className="flex flex-wrap items-center sm:-mx-3">
            <div className="w-full md:w-1/2 md:px-3">
              <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                  <span className="block text-indigo-600 xl:inline">
                    {" "}
                    Essential{" "}
                  </span>
                  <span className="block xl:inline"> Moderation Tools</span>
                </h1>
                <p className="mx-auto text-base text-gray-400 sm:max-w-md lg:text-xl md:max-w-3xl">
                  <strong>Easily</strong> add banned words for your Discord
                  server, delete known phishing links, and more on our online
                  <a
                    className="underline text-blurple"
                    href="https://dash.eviebot.rocks/"
                  >
                    dashboard
                  </a>
                  , for Evie to yell at them for using a banned word in
                  <strong>your</strong> server.
                </p>
                <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                  <a
                    href={invite}
                    className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-indigo-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
                  >
                    Invite Evie
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 ml-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <line x1={5} y1={12} x2={19} y2={12} />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                  <a
                    href="https://dash.eviebot.rocks/"
                    className="flex items-center px-6 py-3 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-600"
                  >
                    Open Dashboard
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 ml-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <line x1={5} y1={12} x2={19} y2={12} />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="w-full h-auto overflow-hidden rounded-md shadow-blurple sm:rounded-xl">
                <Image
                  src="https://dummyimage.com/1071x695/000000/fff"
                  width={1071}
                  height={695}
                  alt="Animated image of a user setting banned words for their server and then testing if Evie deletes the message with the banned word."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-2 py-32 md:px-0">
        <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
          <div className="flex flex-wrap items-center sm:-mx-3">
            <div className="w-full md:w-1/2">
              <div className="w-full h-auto overflow-hidden rounded-md shadow-blurple sm:rounded-xl">
                <Image
                  src="https://dummyimage.com/1071x695/000000/fff"
                  width={1071}
                  height={695}
                  alt="Animated image of a user viewing Hypixel stats, TristanSMP Stats, and Server stats"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 md:px-3">
              <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                  <span className="block text-indigo-600 xl:inline">
                    {" "}
                    Useful{" "}
                  </span>
                  <span className="block xl:inline"> Utilities</span>
                </h1>
                <p className="mx-auto text-base text-gray-400 sm:max-w-md lg:text-xl md:max-w-3xl">
                  Ever wanted to search google, check someone&quot;s Hypixel
                  stats, check how much people are on a Minecraft server, check
                  your TristanSMP stats, and more straight from Discord? Well
                  now you can!
                </p>
                <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                  <a
                    href={invite}
                    className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-indigo-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
                  >
                    Invite Evie
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 ml-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <line x1={5} y1={12} x2={19} y2={12} />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
