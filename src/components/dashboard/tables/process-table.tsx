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

export type Process = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
};

export function ProcessTable() {
  const [data, setData] = useState<Process[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const router = useRouter();
  useEffect(() => {
    async function fetchProcesses() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/processes/get`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching processes:", error);
      }
    }
    fetchProcesses();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((process) =>
      process.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, filteredData]);

  const columns: ColumnDef<Process>[] = [
    {
      accessorKey: "title",
      header: () => "Title",
      cell: ({ row }) => {
        const title = row.getValue("title") as string | undefined;
        const id = row.original._id;
        return title ? (
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => router.push(`/dashboard/records/processdetails/${id}`)}
          >
            {title.length > 20 ? `${title.substring(0, 20)}...` : title}
          </span>
        ) : "No title";
      },
    },
    {
      accessorKey: "description",
      header: () => "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string | undefined;
        return description ? (description.length > 50 ? `${description.substring(0, 50)}...` : description) : "No description";
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
      <h1 className="text-2xl font-bold mb-4">Processes</h1>
      
      {/* Search Input */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search processes..."
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
                No processes found.
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
                <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
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
