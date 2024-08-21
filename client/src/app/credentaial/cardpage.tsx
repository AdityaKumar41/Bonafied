"use client";
import * as React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CardWithForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const courseRef = useRef<HTMLInputElement>(null);
  const [framework, setFramework] = useState<string>("");

  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      students: [
        {
          id: "489666", // Replace with the actual ID or make it dynamic
          name: nameRef.current?.value,
          university: "CUTM", // Replace with the actual university or make it dynamic
          passyear: 2024, // Replace with the actual pass year or make it dynamic
          aadharNumber: "123412341234", // Replace with actual Aadhar number input
          framework, // Chosen framework from the select dropdown
        },
      ],
    };

    try {
      const response = await fetch("http://localhost:5000/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Data submitted successfully:", result);
        // Handle success (e.g., display a success message, clear the form)
      } else {
        console.error("Submission error:", result);
        // Handle error (e.g., display an error message)
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Create Credential</CardTitle>
        <CardDescription>
          Start Your Quick Credential into Blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitData}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="course">Course Program</Label>
              <Input
                id="course"
                placeholder="Name of your project"
                ref={courseRef}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Credential Name</Label>
              <Input
                id="name"
                placeholder="Name of your project"
                ref={nameRef}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select onValueChange={(value) => setFramework(value)}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next" >Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
