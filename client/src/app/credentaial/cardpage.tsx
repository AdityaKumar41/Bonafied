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
import { useUserStore } from "@/components/store";
import toast, { Toaster } from "react-hot-toast";
import { useDataStore } from "@/components/store/data";

interface PropsHandler {
  handleAddABtn: () => void;
}

export function CardWithForm({ handleAddABtn }: PropsHandler) {
  const { user } = useUserStore();
  const { setChanged } = useDataStore();
  const nameRef = useRef<HTMLInputElement>(null);
  const courseRef = useRef<HTMLInputElement>(null);
  const aadhaarRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const [passYear, setPassYear] = useState<string>("");

  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      students: [
        {
          name: nameRef.current?.value,
          university: user?.organizationName,
          passyear: passYear,
          courseProgram: courseRef.current?.value,
          aadharNumber: aadhaarRef.current?.value,
          date: dateRef.current?.value,
        },
      ],
    };

    // Show loading toast

    const toastId = toast.loading("Submitting data...");

    try {
      const response = await fetch("http://localhost:5000/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log(response);

      if (response.statusText === "OK") {
        // Show success toast
        toast.success("Data submitted successfully!", {
          id: toastId,
        });
        setChanged(true);

        // Handle success (e.g., close the form, clear the form)
      } else {
        const result = await response.json();
        // Show error toast
        toast.error("Submission error: " + result.message, {
          id: toastId,
        });
      }
      handleAddABtn();
    } catch (error) {
      // Show error toast
      toast.error("An error occurred: " + (error as Error).message, {
        id: toastId,
      });
    }
  };

  return (
    <>
      <Toaster /> {/* Add the Toaster component here */}
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
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  placeholder="Enter your Aadhaar number"
                  ref={aadhaarRef}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="passyear">Pass Out Year</Label>
                <Select onValueChange={(value) => setPassYear(value)}>
                  <SelectTrigger id="passyear">
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  placeholder="Enter a date"
                  ref={dateRef}
                  type="date"
                />
              </div>
            </div>
            <CardFooter className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={handleAddABtn}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
