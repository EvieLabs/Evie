import { Dispatch, SetStateAction } from "react";

export default function CallToAction(props: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Ready to try Evie?</span>
          <span className="block text-indigo-600">
            Download the latest version of Evie Client.
          </span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow hover:cursor-pointer">
            <a
              onClick={() => props.setOpen(!props.open)}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Download
            </a>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <a
              href="/discord"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Join the Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
