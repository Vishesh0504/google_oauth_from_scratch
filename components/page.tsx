import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
export default function Page() {
  return (
    <div className="flex flex-col px-40 h-screen py-6">
      <div className="flex justify-between">
        <div className="text-primary font-semibold text-2xl">BlogSpace</div>
        <div className="flex gap-2">
          <Link href={""}>My Blog</Link>
          <Button className="font-medium  gap-2 text-">
            <Image src={"/google.png"} alt="google" width={20} height={20} />
            Sign In with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
