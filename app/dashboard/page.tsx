import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    return <div>dashboard</div>;
  } else {
    redirect("/login");
  }
};

export default page;
