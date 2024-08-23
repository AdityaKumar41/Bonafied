"use client";
import React, { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CardWithForm } from "./cardpage";
import { useDataStore } from "@/components/store/data";
import { IconDotsVertical } from "@tabler/icons-react";
import Certified from "@/components/ui/certificate";

// Define the TypeScript interfaces for the data structure
export interface Student {
  _id: string;
  hashedAadhar: string;
  name: string;
  university: string;
  passyear: string;
  date: string;
  hash: string;
  courseProgram: string;
  createdAt: string;
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const [openCertified, setOpenCertified] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { data } = useDataStore();

  const handleAddABtn = () => {
    setOpen(!open);
  };

  const handleCertifiedBtn = (student: Student) => {
    setSelectedStudent(student);
    setOpenCertified((prev) => ({
      ...prev,
      [student._id]: !prev[student._id], // Toggle the state for the specific student
    }));
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
            <TableHead>Hashed Aadhar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Passing Year</TableHead>
            <TableHead>Issued Date</TableHead>
            <TableHead className="text-right">Transaction Hashed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((student) => (
              <TableRow key={student._id}>
                <TableCell className="font-medium">
                  {student.hashedAadhar.slice(0, 15)}
                </TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.university}</TableCell>
                <TableCell>{student.passyear}</TableCell>
                <TableCell>{student.date}</TableCell>
                <TableCell className="text-right">{student.hash}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <IconDotsVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleCertifiedBtn(student)}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total Students</TableCell>
            <TableCell className="text-right">{data.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {open && (
        <div className="absolute top-10 left-1/3 mx-auto">
          <CardWithForm handleAddABtn={handleAddABtn} />
        </div>
      )}

      {selectedStudent && openCertified[selectedStudent._id] && (
        <div className="absolute top-10 right-1/4">
          <Certified student={selectedStudent} />
        </div>
      )}
    </div>
  );
}
