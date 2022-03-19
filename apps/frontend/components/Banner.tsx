import { SpeakerphoneIcon } from "@heroicons/react/outline";

export default function Banner() {
  return (
    <>
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-800">
                <SpeakerphoneIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                ></SpeakerphoneIcon>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden"> We need your help! </span>
                <span className="hidden md:inline">
                  The future of Evie is currently being made and we need your
                  help!
                </span>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <a
                href="https://tristancamejo.notion.site/Re-write-031959a4cda54e8b8ca4848bd7782067"
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
