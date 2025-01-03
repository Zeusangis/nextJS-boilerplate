import { currentProfile } from "@/lib/currentProfile";
import { redirect } from "next/navigation";

import db from "@/lib/db";
import { ServerSidebar } from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const user = await currentProfile();
  if (!user) {
    return redirect("/login");
  }

  const serverId = params.serverId;
  const server = await db.server.findFirst({
    where: {
      id: serverId,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });
  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
