import {
  FlagIcon,
  LightningBoltIcon,
  PencilIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { Tooltip } from "@mui/material";
import ReactCountryFlag from "react-country-flag";

const features = [
  {
    name: "Performance Out of the Box",
    description: (
      <>
        Evie Client is built out of the box to give you the best performance
        possible, with no configuration{" "}
        <Tooltip
          title="On your first Evie Client launch, we will automagically find the best Optifine settings for your device."
          arrow
        >
          <span className="italic">required</span>
        </Tooltip>
        .
      </>
    ),
    icon: LightningBoltIcon,
  },
  {
    name: "Community Driven",
    description: (
      <>
        Evie Client is constantly being updated with new features and
        improvements suggested by our{" "}
        <Tooltip
          title="Join our Discord server to discuss features and ideas."
          arrow
        >
          <span className="italic">community</span>
        </Tooltip>
        .
      </>
    ),
    icon: UserGroupIcon,
  },
  {
    name: "Customizable",
    description: (
      <>
        Every feature part of Evie Client{" "}
        <Tooltip
          title="In the coding language Java, a extend is a keyword that allows you to extend a class. This means you can add new methods and edit existing methods to a already existing class for easy scaling."
          arrow
        >
          <span className="font-bold ">extends</span>
        </Tooltip>{" "}
        the module class which allows us to effortlessly make &quot;mods&quot;
        that can be customized to do whatever{" "}
        <Tooltip
          title="Fair enough you hovered over every other bold word :-)"
          arrow
        >
          <span className="font-bold">you</span>
        </Tooltip>{" "}
        want them to do.
      </>
    ),
    icon: PencilIcon,
  },
  {
    name: "Indie",
    description:
      'Evie Client is developed by a single person who wants to make a difference in the world of "Minecraft pvpers".',
    icon: UserIcon,
  },
];

export default function Features() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            Evie Client
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to play Minecraft.
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Evie Client is a{" "}
            <Tooltip title="very bias opinion from mr tristan" arrow>
              <span className="italic">better</span>
            </Tooltip>{" "}
            alternative to Lunar Client and Badlion Client.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
