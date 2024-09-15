/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */

"use client";

import { experimental_useObject as useObject } from "ai/react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StructuredResponse } from "@/app/api/chat/schema";

export default function Home() {
  const [input, setInput] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const { submit, isLoading, object } = useObject({
    api: "/api/chat",
    schema: StructuredResponse,
    onFinish({ object }) {},
    onError: (error) => {
      // useObject error handling is not passing in the error message atm
      toast.error("There was an API Error, please try again later!");
    },
  });

  return (
    <div className="flex flex-row justify-center pt-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Manufacturing Analysis</h1>
        <p className="text-md text-zinc-500 dark:text-zinc-400">
          Enter a company website to see where they manufacture.
        </p>
        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={(event) => {
            event.preventDefault();

            const form = event.target as HTMLFormElement;

            const input = form.elements.namedItem(
              "companyWebsite"
            ) as HTMLInputElement;

            if (input.value.trim()) {
              submit({ companyWebsite: input.value });
            }
          }}
        >
          <input
            name="companyWebsite"
            className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[500px] max-w-[calc(100dvw-32px)] disabled:text-zinc-400 disabled:cursor-not-allowed placeholder:text-zinc-400"
            placeholder="Expense a transaction..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            disabled={isLoading}
            ref={inputRef}
          />
        </form>

        <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
          <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-800 text-sm dark:text-zinc-200 dark:border-zinc-700">
            {object ? (
              <>
                <h2 className="text-lg font-semibold mb-2">
                  Company Manufacturing Analysis
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Do they manufacture in USA?</p>
                  <p className="font-bold">{object.manufacture_in_usa}</p>
                  <p className="font-medium">Do they manufacture in China?</p>
                  <p className="font-bold">{object.manufacture_in_china}</p>
                  <p className="font-medium">Manufacture in Mexico?</p>
                  <p className="font-bold">{object.manufacture_in_mexico}</p>
                  <p className="font-medium">
                    Do they Manufacture Outside USA/Mexico/China?
                  </p>
                  <p className="font-bold">
                    {object.other_manufacture_outside_of_usa}
                  </p>
                  <p className="font-medium">Score:</p>
                  <p className="font-bold">{object.score}</p>
                </div>
              </>
            ) : (
              <p className="text-center text-zinc-500 dark:text-zinc-400">
                Enter a company website to see the analysis
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
