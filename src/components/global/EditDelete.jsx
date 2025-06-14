"use client";

import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

import CustomButton from "./CustomButton";
import { deleteEvent } from "@/lib/api";

const EditDelete = ({ id }) => {
  console.log("hej");
  const handleDelete = async () => {
    try {
      const response = await deleteEvent(id);
      if (!response.event) {
        throw new Error(`HTTP error! status: ${response.message}`);
      }
    } catch (error) {
      console.error("Fejl ved sletning af event:", error);
      alert("Der skete en fejl under sletning af eventet.");
    }
    alert("Event slettet succesfuldt!");
    redirect("/dashboard");
  };

  return (
    <div className="flex items-center gap-2" style={{ marginBottom: "auto" }}>
      <CustomButton
        text="Rediger"
        type="link"
        link={`/create_edit?eventId=${id}`}
      />
      <AlertDialog>
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
            <AlertDialogCancel>Annuller</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Slet</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDelete;
