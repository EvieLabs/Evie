<script setup lang="ts">
import { lang } from "~/constants/lang";
</script>

<template>
  <div>
    <div class="grid justify-items-stretch ...">
      <div class="justify-self-center ...">
        <h1
          class="text-4xl sm:text-6xl lg:text-7xl leading-none font-extrabold tracking-tight mt-10 mb-8 sm:mt-14 sm:mb-10 text-white text-center"
        >
          {{ lang.marketTitle }}
        </h1>

        <div class="justify-self-center ...">
          <p
            class="text-white text-lg sm:text-2xl sm:leading-10 font-medium mb-10 sm:mb-11 text-center"
          >
            {{ lang.subTitle }}
          </p>
          <div class="grid justify-items-stretch ...">
            <div class="justify-self-center ...">
              <div
                class="transition duration-500 ease-in-out hover: transform hover:-translate-y-1 hover:scale-550..."
              >
                <div class="hover: transition duration-500 hover:scale-125">
                  <a
                    :href="lang.invite"
                    id="GFG"
                    class="box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-blurple rounded-md cursor-pointer group ring-offset-2 ring-1 ring-indigo-300 ring-offset-indigo-200 hover:ring-offset-indigo-500 ease focus:outline-none"
                  >
                    <span
                      class="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"
                    />
                    <span
                      class="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"
                    />
                    <span class="relative z-20 flex items-center text-sm">
                      <svg
                        class="relative w-5 h-5 mr-2 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="{2}"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Invite Evie
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
  <div
    class="text-5xl leading-none font-extrabold tracking-tight mb-4 text-white text-center"
  >
    What is Evie all about?
  </div>
  <section class="px-2 py-32 md:px-0">
    <div class="container items-center max-w-6xl px-8 mx-auto xl:px-5">
      <div class="flex flex-wrap items-center sm:-mx-3">
        <div class="w-full md:w-1/2 md:px-3">
          <div
            class="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0"
          >
            <h1
              class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl"
            >
              <span class="block text-indigo-600 xl:inline"> Essential </span>
              <span class="block xl:inline"> Moderation Tools</span>
            </h1>
            <p
              class="mx-auto text-base text-gray-400 sm:max-w-md lg:text-xl md:max-w-3xl"
            >
              <strong>Easily</strong> add banned words for your Discord server,
              delete known phishing links, and more on our online
              <a
                class="underline text-blurple"
                href="https://dash.eviebot.rocks/"
              >
                dashboard
              </a>
              , for Evie to yell at them for using a banned word in
              <strong>your</strong> server.
            </p>
            <div class="relative flex flex-col sm:flex-row sm:space-x-4">
              <a
                href="https://discord.com/oauth2/authorize?client_id=807543126424158238&permissions=518855707712&scope=bot%20applications.commands"
                class="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-indigo-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
              >
                Invite Evie
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 ml-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <a
                href="https://dash.eviebot.rocks/"
                class="flex items-center px-6 py-3 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-600"
              >
                Open Dashboard
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 ml-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/2">
          <div
            class="w-full h-auto overflow-hidden rounded-md shadow-blurple sm:rounded-xl"
          >
            <img
              src="https://dummyimage.com/1071x695/000000/fff"
              width="{948.666666667}"
              height="{625.333333333}"
              alt="Animated image of a user setting banned words for their server and then testing if Evie deletes the message with the banned word."
            />
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="px-2 py-32 md:px-0">
    <div class="container items-center max-w-6xl px-8 mx-auto xl:px-5">
      <div class="flex flex-wrap items-center sm:-mx-3">
        <div class="w-full md:w-1/2">
          <div
            class="w-full h-auto overflow-hidden rounded-md shadow-blurple sm:rounded-xl"
          >
            <img
              src="https://dummyimage.com/1071x695/000000/fff"
              width="{1071}"
              height="{695}"
              alt="Animated image of a user viewing Hypixel stats, TristanSMP Stats, and Server stats"
            />
          </div>
        </div>
        <div class="w-full md:w-1/2 md:px-3">
          <div
            class="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0"
          >
            <h1
              class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl"
            >
              <span class="block text-indigo-600 xl:inline"> Useful </span>
              <span class="block xl:inline"> Utilities</span>
            </h1>
            <p
              class="mx-auto text-base text-gray-400 sm:max-w-md lg:text-xl md:max-w-3xl"
            >
              Ever wanted to search google, check someone&apos;s Hypixel stats,
              check how much people are on a Minecraft server, check your
              TristanSMP stats, and more straight from Discord? Well now you
              can!
            </p>
            <div class="relative flex flex-col sm:flex-row sm:space-x-4">
              <a
                :href="lang.invite"
                class="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-indigo-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
              >
                Invite Evie
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 ml-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
