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
import { useTranslation } from "@/hooks/use-translation";

interface ClearDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ClearDataDialog({
  isOpen,
  onClose,
  onConfirm,
}: ClearDataDialogProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("dialog.clear_data.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("dialog.clear_data.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {t("dialog.clear_data.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90">
            {t("dialog.clear_data.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
