"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type FAQ = {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  tenantId: string;
};

export function FAQTable() {
  const [data, setData] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const rowsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    async function fetchFAQs() {
      try {
        // Get tenant data from localStorage
        const tenantData = localStorage.getItem('tenantData');
        console.log('Raw tenant data:', tenantData);
        if (!tenantData) {
          setError("Tenant data is required.");
          return;
        }
        // Parse the tenant data
        const parsedTenantData = JSON.parse(tenantData);
        console.log('Parsed tenant data:', parsedTenantData);
        // Extract tenantId from parsed data
        const tenantId = parsedTenantData?.id || parsedTenantData;
        console.log("Tenant ID: ", tenantId);
        if (!tenantId) {
          setError("Tenant ID is required.");
          return;
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/faqs/get`, {
          params: { tenantId: tenantId }
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    }
    fetchFAQs();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, filteredData]);

  const columns: ColumnDef<FAQ>[] = [
    {
      accessorKey: "question",
      header: () => "Question",
      cell: ({ row }) => {
        const question = row.getValue("question") as string | undefined;
        const id = row.original._id;
        return question ? (
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => router.push(`/dashboard/records/faqdetails/${id}`)}
          >
            {question.length > 20 ? `${question.substring(0, 20)}...` : question}
          </span>
        ) : "No question";
      },
    },
    {
      accessorKey: "answer",
      header: () => "Answer",
      cell: ({ row }) => {
        const answer = row.getValue("answer") as string | undefined;
        return answer ? (answer.length > 50 ? `${answer.substring(0, 50)}...` : answer) : "No answer";
      },
    },
    {
      accessorKey: "createdAt",
      header: () => "Created At",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
    },
  ];

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full rounded-md border p-4">
      <h1 className="text-2xl font-bold mb-4">FAQs</h1>
      
      {/* Search Input */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Table className="w-full table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="w-1/3">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="w-1/3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                No FAQs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}