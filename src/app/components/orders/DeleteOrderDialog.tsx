import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Sale } from "@/src/types/types";

interface DeleteOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  sale: Sale | null;

  onDelete: () => void;
  loading?: boolean;
}

export function DeleteOrderDialog({
  open,
  onOpenChange,
  sale,
  onDelete,
  loading = false,
}: DeleteOrderDialogProps) {
  if (!sale) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Order
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {sale.saleCode}
            </span>
            ?
            <br />
            <br />
            This action cannot be undone and will permanently remove
            the order and all of its items.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}