"use client";  

import { Input } from "@/components/ui/input"
import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Editor from "./Editor"
import { FormEvent } from "react"
import ManageUsers from "./ManageUsers"
import { updateDoc, doc } from "firebase/firestore"
import { db } from "@/firebase"
import { useDocumentData } from "react-firebase-hooks/firestore"
import useOwner from "@/lib/useOwner"
import DeleteDocument from "./DeleteDocument"
import InviteUser from "./InviteUser"


import Avatars from "./Avatars"

function Document({id}: {id:string}) {
    const [data] = useDocumentData(doc(db, "documents", id))
    const [input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition(); 
    const isOwner = useOwner();

   
    useEffect(() => {
      if(data) {
        setInput(data.title);
      }
    }, [data]) 

    const updateTitle = (e: FormEvent) => {
        e.preventDefault();
        if(input.trim()) {
            startTransition(async () => {
                await updateDoc(doc(db, "documents", id), {
                    title: input,
                });
            });
        }
    };

  return (
    <div className="flex-1 h-full bg-white p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form className="flex flex-1 space-x-2" onSubmit={updateTitle}>
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </form>
      </div>  
      <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
        {isOwner && (
          <div className="flex items-center space-x-2">
            
            <InviteUser />
            <DeleteDocument />
          </div>
        )}
        <ManageUsers/>
        <Avatars/>
      </div>
      <hr className="pb-10"/>
      <Editor/>
    </div>
  );
}

export default Document