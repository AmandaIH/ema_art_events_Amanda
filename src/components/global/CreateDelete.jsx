"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogHeader,
} from "@radix-ui/react-alert-dialog";

const CreateDelete = ({ id }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://ema-async-exhibit-server.onrender.com/events/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("Event slettet succesfuldt!");
      setOpen(false);
      router.refresh("/dashboard");
    } catch (error) {
      console.error("Fejl ved sletning af event:", error);
      alert("Der skete en fejl under sletning af eventet.");
      setOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2" style={{ marginBottom: "auto" }}>
      <CustomButton
        text="Rediger"
        onClick={() => {
          router.push(`/create_edit?eventId=${id}`);
        }}
      />
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <CustomButton text="Slet" variant="destructive" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på, at du vil slette dette event? Denne handling kan
              ikke fortrydes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-end">
            <AlertDialogCancel
              onClick={() => {
                setOpen(false);
              }}
            >
              Annuller
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Slet</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateDelete;
