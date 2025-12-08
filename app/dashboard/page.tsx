import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <div>
        <div className="flex flex-row items-center justify-center gap-3">
          <Button>Pantry</Button>
          <Button>Generate</Button>
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
};

export default page;
