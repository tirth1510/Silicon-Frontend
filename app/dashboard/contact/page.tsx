/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Reply, Send, RefreshCw } from "lucide-react";

// Define the Contact interface based on your API response
interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function ContactDashboardPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Response form state
  const [responseSubject, setResponseSubject] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Fetch contacts from the API
  const fetchContacts = async () => {
    try {
      setLoading(true);
      // Assuming the route is mapped to getAllContacts controller
      const res = await axios.get("http://localhost:5000/api/contact/all");
      if (res.data.success) {
        setContacts(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Open dialog handler
  const handleOpenResponseDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setResponseSubject(`Re: ${contact.subject}`);
    setResponseMessage(`Dear ${contact.name},\n\nThank you for contacting us regarding "${contact.subject}".\n\n`);
    setIsDialogOpen(true);
  };

  // Send response handler
  const handleSendResponse = async () => {
    if (!selectedContact) return;
    if (!responseMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      setSending(true);
      const payload = {
        email: selectedContact.email,
        subject: responseSubject,
        message: responseMessage,
      };

      await axios.post("http://localhost:5000/api/contact/response", payload);
      
      toast.success("Response email sent successfully");
      setIsDialogOpen(false);
      setResponseSubject("");
      setResponseMessage("");
      setSelectedContact(null);
    } catch (error: any) {
      console.error("Error sending response:", error);
      toast.error(error.response?.data?.error || "Failed to send response");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contact Messages</h1>
          <p className="text-gray-500 mt-1">Manage and respond to customer inquiries.</p>
        </div>
        <Button onClick={fetchContacts} variant="outline" size="sm" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading messages...
                  </div>
                </TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell className="whitespace-nowrap text-gray-600">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell className="max-w-[250px] truncate" title={contact.subject}>
                    {contact.subject}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleOpenResponseDialog(contact)}
                      className="gap-2 bg-blue-900 hover:bg-blue-800"
                    >
                      <Reply className="h-4 w-4" />
                      Response
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Response Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send Response</DialogTitle>
            <DialogDescription>
              Replying to <span className="font-semibold text-blue-900">{selectedContact?.name}</span> ({selectedContact?.email})
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                value={responseSubject}
                onChange={(e) => setResponseSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Type your response here..."
                className="min-h-[200px] resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={sending}>
              Cancel
            </Button>
            <Button onClick={handleSendResponse} disabled={sending} className="gap-2 bg-blue-900 hover:bg-blue-800">
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}