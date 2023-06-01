import { type NextPage } from "next";
import { Image } from "@nextui-org/react";
import Layout from "@/components/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Layout title="Home">
        <div className="grid items-center grid-cols-6 gap-8 mx-auto lg:grid-cols-12">
          <div className="flex flex-wrap col-span-6 my-auto ml-0 text-center lg:ml-10 xl:ml-20 mb-18 lg:text-left">
            <h1 className="max-w-xl mx-auto text-5xl font-black leading-tight tracking-wide text-transparent lg:text-6xl bg-gradient-to-br from-violet-500 to-fuchsia-500 bg-clip-text lg:mx-0">
              Codingan Error?
              <br />Ke Script Cafe aja!
            </h1>
            <p className="max-w-xl mx-auto font-medium leading-relaxed mt-7 lg:mx-0">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio, ratione. Aperiam enim at modi dolorum, minima esse molestiae hic magnam recusandae, itaque odio fugit rem sunt debitis tempore omnis fugiat!
            </p>
          </div>
          <div className="col-span-6 m-auto mt-10 lg:mt-0">
            <Image
              disableSkeleton={false}
              isBlurred
              width={480}
              src="/hero.png"
              alt="Hero Image"
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
