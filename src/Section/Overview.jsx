import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "../Components/AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const Overview = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true, 
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen ">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          welcome to Console-Craft
        </p>
        <AnimatedTitle
          title="Find the <b>G</b>ame  <br /> of your <b>D</b>ream <br /> make it to <b>R</b>eality"
          containerClass="mt-5 !text-black text-center"
        />
        <div className="about-subtext">
          <p>Unleash Your Gaming Passion—Consoles, PCs, and More Await</p>
          <p className="text-gray-500">
            Discover the ultimate destination for PlayStations, custom PC
            builds, and gaming gear to level up your experience
          </p>
        </div>
      </div>
      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
