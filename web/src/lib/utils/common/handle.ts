import { toast } from "svelte-sonner";
import type { ApiErrorResponse } from "../api-response.types";

export const handleFailure = (data: any, message: string) => {
  if (data?.apiError) {
    const apiError = data.apiError as ApiErrorResponse;
    toast.error(apiError.message, {
      duration: 5000,
    });
    return;
  }

  let errorMessage = message;
  if (typeof data?.message === "string") {
    errorMessage = data.message;
  } else if (data?.form?.message) {
    errorMessage = data.form.message;
  }
  toast.error(errorMessage);
};

export const handleKeydown = (
  e: KeyboardEvent,
  onClose: () => void,
  condition: Boolean,
) => {
  if (e.key === "Escape" && condition) {
    onClose();
  }
};

export const handleBackdropClick = (e: MouseEvent, onClose: () => void) => {
  if (e.target === e.currentTarget) {
    onClose();
  }
};
