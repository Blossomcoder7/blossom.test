import XSpacing from "../../../components/wrappers/XSpacing";
import HomeLoading from "./HomeLoading";

const Banner = () => {
  return (
    <>
      <HomeLoading>
        <BannerContent />
      </HomeLoading>
    </>
  );
};

export default Banner;

const BannerContent = () => {
  return (
    <div className="w-full h-[clamp(450px,100vh,1200px)]  flex items-center justify-center bg-icm-black">
      <XSpacing className="flex-row  ">
        <div className="w-1/2 h-full flex items-center relative justify-center">
          <div className="w-full h-fit flex pt-15 flex-col absolute top-1/2 left-1/2 -translate-1/2">
                {/* <p className="text-[clamp(40px,3vw,120px)] indent-2 leading-none text-left whitespace-nowrap text-icm-black font-black ">
                  Blossom Coder is a{" "}
                </p>
                <p className="text-[clamp(100px,9vw,180px)] leading-none text-left  text-icm-primary font-black uppercase ">
                  Creative{" "}
                </p>
                <p className="text-[clamp(40px,3vw,120px)] indent-2 leading-none text-left whitespace-nowrap text-icm-black font-black ">
                  Agency
                </p> */}
                <p className="text-icm-white text-h4 font-semibold ">
                  With an awesome working environment and a high degree of
                  proficiency we at Blossom Coder are Creative and innovative
                  members highly skilled in Website design & Development. We are
                  having more than 10 years of Experience and always up to take
                  coding challenges as per custom made client requirements. We
                  believe in delivering 100% accurate website solutions and rich
                  experience in e-commerce websites.
                </p>
           
              </div>
        </div>
        <div className="w-1/2 h-full flex items-center justify-center ">
          <img
            src="https://blossomcoder.com/wp-content/uploads/2022/12/bn.png"
            alt="Web Development"
            className="w-full h-full object-contain object-center"
          ></img>
        </div>
      </XSpacing>
    </div>
  );
};
