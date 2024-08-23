import React from "react";

// Define the TypeScript interface for the student object
interface Student {
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

// The Certified component that receives the student object and displays the certificate details
function Certified({ student }: { student: Student }) {
  return (
    <div className="bg-blue-600 relative w-[800px] h-[640px] overflow-hidden text-light-blue bg-blue bg-no-repeat bg-center bg-cover p-10">
      <Icon />
      <p className="byline absolute right-10">Certificate of completion</p>

      <div className="content absolute top-48 right-20 w-3/5">
        <p>Awarded to</p>
        <h1 className="text-white text-3xl font-bold mb-8">{student.name}</h1>
        <p>for completing:</p>
        <h2 className="text-2xl font-medium mb-4">{student.courseProgram}</h2>
        <p className="text-sm font-medium">
          <span className="font-bold">Hash Key:</span> {student.hash}
        </p>
      </div>

      {student.date && (
        <p className="date absolute bottom-10 text-xs">
          Issued on <span className="font-bold">{student.createdAt}</span>
        </p>
      )}
    </div>
  );
}

// Default props for the Certified component
Certified.defaultProps = {
  student: {
    name: "James Lee",
    course: "Creating PDFs with React & Make.cm",
    date: "March 15 2021",
    hashKey: "1234567890abcdef",
  },
};

// The Icon component that renders the SVG graphic on the certificate
const Icon = () => (
  <svg
    width="99"
    height="139"
    viewBox="0 0 99 139"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute top-0"
  >
    <path d="M0 0H99V138.406L52.1955 118.324L0 138.406V0Z" fill="white" />
    <path
      d="M25.4912 83.2515C25.4912 79.4116 27.0222 75.7289 29.7474 73.0137C32.4727 70.2985 36.1689 68.7731 40.0229 68.7731C43.877 68.7731 47.5732 70.2985 50.2984 73.0137C53.0236 75.7289 54.5546 79.4116 54.5546 83.2515M40.0229 59.724C40.0229 55.8841 41.5539 52.2014 44.2791 49.4862C47.0044 46.7709 50.7006 45.2455 54.5546 45.2455C58.4087 45.2455 62.1049 46.7709 64.8301 49.4862C67.5553 52.2014 69.0863 55.8841 69.0863 59.724V83.2515"
      stroke="#0379FF"
      strokeWidth="10.6193"
    />
  </svg>
);

export default Certified;
