"use client";

import React, { Suspense } from "react";
import { Dancing_Script } from "next/font/google";
import FormLogin from "./FormLogin.js";

const inter = Dancing_Script({ subsets: ["latin"] });

function page() {
  return (
    <div className="grid grid-cols-2 bg-zinc-800 w-screen h-screen ">
      <div className={inter.className}>
        <div className="w-[60%] ml-auto mr-auto">
          <div className="h-[100px]"></div>
          <div>
            <p className="my-4 text-center text-3xl text-amber-500">
              Login Your Account
            </p>
          </div>
          <FormLogin></FormLogin>
        </div>
      </div>
      <div></div>
    
    </div>
  );
}

export default page;
