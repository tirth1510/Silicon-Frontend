/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, 
  Reply, 
  Send, 
  RefreshCw, 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  User
} from "lucide-react";

interface Contact {
  _id: string;
  contactId: string;
  name: string;
  email: string;
  phone: string;
  messageTitle?: string;
  message: string;
  createdAt: string;
}

export default function ContactDashboardPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Dialog States
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  
  const [responseMessage, setResponseMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/all`);
      if (res.data.success) {
        setContacts(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleOpenView = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewOpen(true);
  };

  const handleOpenReply = (contact: Contact) => {
    setSelectedContact(contact);
    setResponseMessage(`Hello ${contact.name},\n\nThank you for reaching out to Silicon Meditech regarding "${contact.messageTitle || 'your inquiry'}". \n\n`);
    setIsReplyOpen(true);
  };

  const handleSendResponse = async () => {
    if (!selectedContact || !responseMessage.trim()) {
      toast.error("Please type a message");
      return;
    }

    try {
      setSending(true);
      const payload = {
        contactId: selectedContact.contactId,
        responseMessage: responseMessage,
      };

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/send-response`, payload);
      
      if (res.data.success) {
        toast.success("Response sent successfully via Email");
        setIsReplyOpen(false);
        setResponseMessage("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send response");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">Customer Inquiries</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and respond to Silicon Meditech inquiries.</p>
        </div>
        <Button onClick={fetchContacts} variant="secondary" className="bg-white border shadow-sm text-blue-900 hover:bg-blue-50">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-white border-none rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-blue-900">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-blue-50 font-bold py-5 pl-6">Date</TableHead>
              <TableHead className="text-blue-50 font-bold">Customer</TableHead>
              <TableHead className="text-blue-50 font-bold">Inquiry Title</TableHead>
              <TableHead className="text-blue-50 font-bold text-center">Status</TableHead>
              <TableHead className="text-blue-50 font-bold text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-64 text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto text-blue-900" /></TableCell></TableRow>
            ) : contacts.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-64 text-center text-slate-400">No active inquiries found.</TableCell></TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact._id} className="hover:bg-blue-50/30 transition-colors border-b border-slate-100">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Calendar className="h-4 w-4" /> {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">{contact.name}</div>
                    <div className="text-xs text-blue-600 font-medium">{contact.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-3">
                      {contact.messageTitle || "General Inquiry"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">Received</Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenView(contact)}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl"
                    >
                      <Eye className="h-4 w-4 mr-1.5" /> View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleOpenReply(contact)}
                      className="bg-blue-900 hover:bg-blue-800 rounded-xl"
                    >
                      <Reply className="h-4 w-4 mr-1.5" /> Reply
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* VIEW DIALOG */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-3xl border-none">
          <div className="bg-blue-900 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="bg-white/20 p-2 rounded-xl"><Eye className="h-6 w-6" /></div>
               <DialogTitle className="text-xl font-bold">Inquiry Details</DialogTitle>
            </div>
            <Badge className="bg-white text-blue-900">Ref: {selectedContact?._id.slice(-6).toUpperCase()}</Badge>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</p>
                <div className="flex items-center gap-2 font-bold text-blue-900"><User className="h-4 w-4" /> {selectedContact?.name}</div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                <div className="flex items-center gap-2 font-bold text-slate-700"><Phone className="h-4 w-4" /> {selectedContact?.phone}</div>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                <div className="flex items-center gap-2 font-bold text-blue-600"><Mail className="h-4 w-4" /> {selectedContact?.email}</div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-700">Message Content</p>
              <ScrollArea className="h-40 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="text-slate-600 leading-relaxed font-medium">
                  {selectedContact?.message}
                </p>
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter className="p-6 bg-slate-50 border-t flex justify-end">
            <Button onClick={() => setIsViewOpen(false)} className="bg-blue-900 rounded-xl px-10">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REPLY DIALOG */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-3xl p-0 overflow-hidden border-none">
          <DialogHeader className="bg-blue-900 p-6 text-white">
            <DialogTitle className="text-xl font-bold">Official Response</DialogTitle>
            <DialogDescription className="text-blue-100">
              Replying to: <span className="font-bold text-white">{selectedContact?.name}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-blue-900 italic text-slate-600 text-sm">
              "{selectedContact?.message}"
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Message Body</label>
              <Textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Type your reply here..."
                className="min-h-[200px] rounded-2xl border-slate-200 focus:ring-blue-900 resize-none p-4"
              />
            </div>
          </div>

          <DialogFooter className="p-6 flex gap-3">
            <Button variant="ghost" onClick={() => setIsReplyOpen(false)} disabled={sending} className="rounded-xl">
              Discard
            </Button>
            <Button 
              onClick={handleSendResponse} 
              disabled={sending} 
              className="bg-blue-900 hover:bg-blue-800 rounded-xl px-8 flex-1 sm:flex-none"
            >
              {sending ? <Loader2 className="animate-spin h-4 w-4" /> : <><Send className="mr-2 h-4 w-4" /> Send Email</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}