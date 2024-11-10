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

import { toast } from "sonner";



import { useUser } from "@clerk/nextjs";
import { query, collectionGroup, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "@/firebase"
import useOwner from "@/lib/useOwner"
import { useRoom } from "@liveblocks/react"
import { removeUserFromDocument } from "@/actions/actions"

  
function ManageUsers() {
    const[isOpen, setIsOpen] = useState(false);
    const[isPending, startTransition] = useTransition();
    const { user } = useUser();
    const isOwner = useOwner(); 
    const room = useRoom(); 

    const [usersInRoom] = useCollection(
       user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id ))
    );



    const handleDelete = (userId: string)=> {

      startTransition(async() => {
        if(!user) return;
        const success  = await removeUserFromDocument(room.id, userId);

        if(success) {
          toast.success("User removed successfully");
        } else {
          toast.error("Failed to remove user");
        }
      })
       

    };

  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="outline">
    <DialogTrigger>Users ({usersInRoom?.docs.length})</DialogTrigger>
    </Button>
 
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Users with Access</DialogTitle>
      <DialogDescription>
        Below are users who have access to this document.
      </DialogDescription>
    </DialogHeader>
    <hr className="my-2" />

    <div className="flex flex-col space-y-2">

      {usersInRoom?.docs.map((doc) => (
        <div key={doc.data().userId} className="flex justify-between items-center">
          

          <p>
            {doc.data().userId === user?.emailAddresses[0].emailAddress ? 
            `You (${doc.data().userId})`
            : doc.data().userId}
          </p>

          <div className="flex items-center gap-2">
            <Button variant="outline" >{doc.data().role}</Button>

            {isOwner && doc.data().userId !== user?.emailAddresses[0].emailAddress && (
              <Button variant="destructive" 
              onClick={()=> handleDelete(doc.data().userId)}
                disabled={isPending} size="sm"
              >
                {isPending ? "Removing..." : "X"}
              </Button>
            )}
              
          </div>
        </div>
      ))}

    </div>

   

  </DialogContent>
</Dialog>

};

export default ManageUsers;