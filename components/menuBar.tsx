'use client';

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
import {useSession, signIn, signOut} from "next-auth/react";

export function MenuBar() {
    const { data: session } = useSession();
    return (
        <nav className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-16 justify-between px-8">
                <Link href="/" className="flex items-center text-lg font-bold">
                    FlavorForge
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
                                <button
                                    onClick={() => signOut({callbackUrl: '/'})}
                                    className="w-20 text-center text-sm font-medium text-foreground"
                                >
                                    Log Out
                                </button>
                                </NavigationMenuItem>
                            </> 
                        ) : (
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                {/* Show a "Log In" button */}
                                <button
                                    onClick={() => signIn()}
                                    className="w-20 text-center text-sm font-medium text-foreground"
                                >
                                    Log In
                                </button>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}
                        <NavigationMenuItem>
                            <ModeToggle></ModeToggle>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </ nav>
    )
}