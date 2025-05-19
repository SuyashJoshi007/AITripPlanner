import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

function Header() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log(user);
  }, [user]);

  // Function to fetch user info from Google API
  async function GetUserProfile(tokenResponse) {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      });
      const profile = await res.json();
      // Save user data to state and localStorage
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="App Logo" className="w-15 h-auto" />
        <img src="/text.png" alt="App Logo" className="w-40 h-auto" />
      </div>
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/my-trips">
              <Button
                variant="outline"
                className="round hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                My Trips
              </Button>
            </a>

            <Popover>
              <PopoverTrigger>
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="w-fit p-2 text-sm">
                <h2
                  className="cursor-pointer transition duration-200 px-2 py-1 rounded-md hover:bg-gray-100 hover:text-red-600"
                  onClick={() => {
                    googleLogout();
                    localStorage.removeItem("user");
                    setUser(null);
                    window.location.reload();
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <>
            <Button className="cursor-pointer" onClick={() => setOpenDialog(true) }>Sign In</Button>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <DialogDescription>
                    <div>
                      <img
                        src="/logo.png"
                        alt="App Logo"
                        className="w-15 h-auto"
                      />
                      <img
                        src="/text.png"
                        alt="App Logo"
                        className="w-20 h-auto"
                      />
                    </div>
                    <h2 className="font-bold text-lg mt-2">
                      Sign In With Google
                    </h2>
                    Sign in to Google authentication securely
                    <Button
                      onClick={() => login()}
                      className="w-full mt-5 flex gap-4 items-center cursor-pointer"
                    >
                      <FcGoogle className="h-7 w-7 " />
                      Sign In With Google
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
