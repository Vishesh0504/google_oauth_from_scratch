import { Button } from "@/components/ui/button";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import Image from "next/image";
import { PencilIcon } from "@heroicons/react/24/solid";
export default function Page() {
  const features = [
    {
      title: "Rich Markdown editor",
      desc: "Write beautiful content with our powerful markdown editor with real-time preview.",
      icon: <PencilIcon className="text-primary size-5" />,
    },
    {
      title: "Custom Themes",
      desc: "Write beautiful content with our powerful markdown editor with real-time preview.",
      icon: <PencilIcon className="text-primary size-5" />,
    },
    {
      title: "Rich Markdown editor",
      desc: "Write beautiful content with our powerful markdown editor with real-time preview.",
      icon: <PencilIcon className="text-primary size-5" />,
    },
  ];
  return (
    <div className="flex flex-col px-28 h-screen py-6 ">
      <div
        className="flex justify-between
      items-center
      "
      >
        <div className="text-primary font-semibold text-2xl  ">BlogSpace</div>
        <div className="flex gap-6 items-center">
          <Link
            className="flex gap-2 text-foreground/80 hover:text-primary items-center text-sm"
            href={""}
          >
            My Blog
            <ArrowTopRightOnSquareIcon className="size-4" />
          </Link>
          <form action={"/api/auth/login"} method="GET">
            <Button className="font-medium  gap-2 hover:-translate-y-1 hover:shadow-sm hover:shadow-primary transition-all ">
              <Image src={"/google.png"} alt="google" width={15} height={20} />
              Sign In with Google
            </Button>
          </form>
        </div>
      </div>
      <div className="flex grow flex-col justify-center gap-40">
        <div className="flex flex-col gap-4 justify-center items-center ">
          <div className="text-6xl font-semibold">
            Share Your Story with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">
              BlogSpace
            </span>
          </div>
          <div className="text-foreground/80 text-lg">
            The simplest way to create and manage your blog, built for everyone.
          </div>
        </div>
        <div className="flex gap-12 px-28 ">
          {features.map((feat, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg bg-secondary px-6 py-4 gap-3 border border-transparent tranisition-all hover:border-primary"
            >
              <div className="flex gap-3  items-center ">
                {feat.icon}
                <span className="font-semibold text-lg">{feat.title}</span>
              </div>
              <div className="text-foreground/80 text-sm tracking-wide">
                {feat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
