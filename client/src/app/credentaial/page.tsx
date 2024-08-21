"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CardWithForm } from "./cardpage";

interface Data {
  id: number;
  name: string;
  university: string;
  passyear: number;
  hashedAadhar: string;
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/get")
      .then(async (res) => {
        const fetchedData = await res.json();
        setData(fetchedData);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);
  const handleAddABtn = () => {
    setOpen(!open);
  };

  return (
    <div className="p-4 bg-white h-screen relative w-full overflow-y-auto custom-class-scroll">
      <Button onClick={handleAddABtn} className="dark flex justify-end">
        Add
      </Button>

      <Table>
        <TableCaption>A list of students' data.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Passing Year</TableHead>
            <TableHead className="text-right">Hashed Aadhar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.university}</TableCell>
                <TableCell>{student.passyear}</TableCell>
                <TableCell className="text-right">
                  {student.hashedAadhar}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Students</TableCell>
            <TableCell className="text-right">{data.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {open && (
        <div className="absolute top-20 left-1/3 mx-auto">
          <CardWithForm />
        </div>
      )}
    </div>
  );
}
