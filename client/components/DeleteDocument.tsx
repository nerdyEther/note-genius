"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,  // Add this line
  } from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteDocument } from "@/actions/actions";
  
function DeleteDocument() {
    const[isOpen, setIsOpen] = useState(false);
    const[isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const router = useRouter();

    const handleDelete = async () => {
        const roomId = pathname.split("/").pop();
        if(!roomId) return;

        startTransition(async () => {
            const { success} =await deleteDocument(roomId);

            if(success){
                setIsOpen(false);
                router.replace("/");
                toast.success("Document deleted");

            
            }
            else{
                toast.error("Failed to delete document"); 
            }
        })

    }

  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="destructive">
    <DialogTrigger>Delete</DialogTrigger>
    </Button>
 
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure you want to delete?</DialogTitle>
      <DialogDescription>
        This will delete the document and all the content and users in it.
      </DialogDescription>
    </DialogHeader>


    <div className="flex justify-end gap-2 mt-4">
        <Button
         type="button"
         variant="destructive"
         onClick={handleDelete}
         disabled={isPending}
        >
           {isPending ? "Deleting..." : "Delete"}
        </Button>

        <DialogClose asChild>
            <Button type="button" variant="secondary">
                 Close
            </Button>
        </DialogClose>

    </div>
  </DialogContent>
</Dialog>

};

export default DeleteDocument