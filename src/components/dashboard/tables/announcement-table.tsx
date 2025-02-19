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

export type Announcement = {
  _id: string;
  title: string;
  details: string;
  postedBy: string;
  createdAt: string;
};

export function AnnouncementTable() {
  const [data, setData] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 1;
  const router = useRouter();
  
  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements/get`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    }
    fetchAnnouncements();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((announcement) =>
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, filteredData]);

  const columns: ColumnDef<Announcement>[] = [
    {
      accessorKey: "title",
      header: () => "Title",
      cell: ({ row }) => {
        const title = row.getValue("title") as string | undefined;
        const id = row.original._id; // Get the ID of the announcement
  
        return (
          <button
            onClick={() => router.push(`/dashboard/records/announcementdetails/${id}`)}
            className="text-blue-500 hover:underline"
          >
            {title ? (title.length > 20 ? `${title.substring(0, 20)}...` : title) : "No title"}
          </button>
        );
      },
    },
    {
      accessorKey: "details",
      header: () => "Details",
      cell: ({ row }) => {
        const details = row.getValue("details") as string | undefined;
        return details ? (details.length > 50 ? `${details.substring(0, 50)}...` : details) : "No details";
      },
    },
    {
      accessorKey: "postedBy",
      header: () => "Posted By",
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
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Table className="w-full table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="w-1/4 truncate">
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
                  <TableCell key={cell.id} className="w-1/4 truncate overflow-hidden">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                No announcements found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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
