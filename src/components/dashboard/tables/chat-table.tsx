"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define the type for a chat
export type Chat = {
  _id: string;
  query: string;
  response: string;
  isGoodResponse: boolean | null;
  createdAt: string;
};

export function ChatTable() {
  const [data, setData] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchChats();
  }, []);

  async function fetchChats() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/chats`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }

  async function updateChatStatus(id: string, action: "like" | "dislike") {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/update-chat-status/${id}`, { action });
      fetchChats(); // Refresh the data
    } catch (error) {
      console.error("Error updating chat status:", error);
    }
  }

  async function deleteChat(id: string) {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/delete/${id}`);
      fetchChats(); // Refresh the data
      setShowConfirmModal(false); // Close the confirmation modal
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  }

  const filteredData = useMemo(() => {
    return data.filter((chat) => {
      const matchesSearch = chat.query.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "good" && chat.isGoodResponse === true) ||
        (filter === "bad" && chat.isGoodResponse === false);
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter, data]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, filteredData]);

  const columns: ColumnDef<Chat>[] = [
    {
      accessorKey: "query",
      header: "Query",
      cell: ({ row }) => {
        const query = row.getValue("query") as string;
        return query.length > 30 ? `${query.substring(0, 30)}...` : query;
      },
    },
    {
      accessorKey: "response",
      header: "Response",
      cell: ({ row }) => {
        const response = row.getValue("response") as string;
        return response.length > 50 ? `${response.substring(0, 50)}...` : response;
      },
    },
    {
      accessorKey: "isGoodResponse",
      header: "Response Type",
      cell: ({ row }) => {
        const isGoodResponse = row.getValue("isGoodResponse") as boolean | null;
        return isGoodResponse === null ? "Pending" : isGoodResponse ? "Good" : "Bad";
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const chatId = row.original._id;
        return (
          <div className="flex gap-2">
            {/* On desktop, show buttons directly */}
            <div className="hidden md:flex gap-2">
              <Button
                variant="outline"
                onClick={() => updateChatStatus(chatId, "like")}
                disabled={row.original.isGoodResponse === true}
              >
                Good
              </Button>
              <Button
                variant="outline"
                onClick={() => updateChatStatus(chatId, "dislike")}
                disabled={row.original.isGoodResponse === false}
              >
                Bad
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setChatToDelete(chatId); // Set the chat to delete
                  setShowConfirmModal(true); // Show confirmation modal
                }}
                className="text-red-500"
              >
                Delete
              </Button>
            </div>

            {/* On mobile, show buttons in a dropdown */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => updateChatStatus(chatId, "like")}
                    disabled={row.original.isGoodResponse === true}
                  >
                    Mark as Good
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateChatStatus(chatId, "dislike")}
                    disabled={row.original.isGoodResponse === false}
                  >
                    Mark as Bad
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setChatToDelete(chatId); // Set the chat to delete
                      setShowConfirmModal(true); // Show confirmation modal
                    }}
                    className="text-red-500"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full rounded-md border p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Logs</h1>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search queries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select onValueChange={setFilter} value={filter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by response type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="good">Good Responses</SelectItem>
            <SelectItem value="bad">Bad Responses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table className="w-full table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="w-1/5">
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
                  <TableCell key={cell.id} className="truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                No chats found.
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
              <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (chatToDelete) deleteChat(chatToDelete);
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
