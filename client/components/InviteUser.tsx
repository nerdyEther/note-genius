"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    // Add this line
  } from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input"

import { inviteUserToDocument } from "@/actions/actions"
import { FormEvent } from "react";  // Add this import

  
function InviteUser() {
    const[isOpen, setIsOpen] = useState(false);
    const[isPending, startTransition] = useTransition();
    const[email, setEmail] = useState("");
    const pathname = usePathname();
    



    const handleInvite = async (e: FormEvent) => {
        e.preventDefault();
        
        const roomId= pathname.split("/").pop();
        if(!roomId) return;

        startTransition(async () => {
            const{success} = await inviteUserToDocument(roomId, email);

            if(success){
                setIsOpen(false);
                setEmail("");
                toast.success("Invited user to document!");
            } else{
                toast.error("Failed to invite user to collab!");
            }
        });

    };

  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="outline">
    <DialogTrigger>Invite</DialogTrigger>
    </Button>
 
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Invite a user to collab!</DialogTitle>
      <DialogDescription>
        Enter the email of the user you want to invite.
      </DialogDescription>
    </DialogHeader>

    <form className="flex gap-2" onSubmit={handleInvite}>
        <Input
          type="email"
          placeholder="Email"
          className="w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" disabled={!email || isPending}>
            {isPending ? "Inviting..." : "Invite"}
            </Button>
    </form>

  </DialogContent>
</Dialog>

};

export default InviteUser;