"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

import { LogInIcon, LogOutIcon } from "lucide-react";

type Props = {
  className?: string;
};

export function MenuBar(props: Props) {
  const { data: session } = useSession();
  let navClassName = props.className ? props.className : "";
  navClassName +=
    " top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60";

  return (
    <nav className={navClassName}>
      <div className="flex h-16 justify-between px-8">
        <Link href="/" className="flex items-center text-lg font-bold">
          <img className="h-10 mr-3" src="flavor_forge.svg"></img>
          <span>FlavorForge</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            {session ? (
              <>
                <NavigationMenuItem>
                  {/* Show the user's name (or email) */}
                  <span className="px-3 text-sm font-medium text-foreground">
                    Hi, {session.user?.name || session.user?.email}
                  </span>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  {/* Show a "Log Out" button */}
                  <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex flex-row items-center gap-2"
                    variant="outline"
                  >
                    <LogOutIcon /> Log Out
                  </Button>
                </NavigationMenuItem>
              </>
            ) : (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  {/* Show a "Log In" button */}
                  <Button
                    onClick={() => signIn()}
                    className="flex flex-row items-center gap-2"
                    variant="outline"
                  >
                    <LogInIcon /> Log In
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <ModeToggle></ModeToggle>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
